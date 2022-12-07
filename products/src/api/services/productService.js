const db = require("../../models/index");
const sequelize = require('sequelize');
const { ErrorCodes } = require("../constants/HTTPResponse");
const ProductResponse = require("../../dtos/createOrUpdateProductResponseDto");
const { validateProduct } = require("../../dtos/productCreateOrUpdateDto");
const { CreateStatus } = require('../constants/Enum');
const { unique } = require('../../utils/removeDuplicateItem');
const Product = require('../../dtos/productPaginatingResponse');
exports.getByConditions = async (query) => {
    let condition = {
        deleted: false
    };
    if (query.categoryId) {
        condition.categoryId = query.categoryId;
    }
    if (query.search)
    condition.title = sequelize.where(sequelize.fn('LOWER', sequelize.col('Products.title')), 'LIKE', '%' + query.search.toLowerCase() + '%')
    var pageIndex = query.pageNumber ? parseInt(query.pageNumber) != 1 ? parseInt(query.pageNumber) : 1 : 1;
    var pageSize = query.pageNumber ? parseInt(query.pageSize) != 4 ? parseInt(query.pageSize) : 4 : 4;
    let offset = pageSize * (pageIndex - 1);
    let order = [['title', 'asc']]
    if (query) {
        if (query.name == "title") {
            if (query.order == "desc") {
                order = [['title', 'desc']]
            } else {
                order = [['title', 'asc']]
            }
        } else {
            if (query.order == "desc") {
                order = [['price', 'desc']]
            } else {
                order = [['price', 'asc']]
            }
        }
    }
    const data = await db.Products.findAll({
        where: condition,
        offset: offset,
        limit: pageSize,
        order: order,
    });
    const dataTotal = await db.Products.findAll({
        where: condition
    });
    if(pageSize > dataTotal.length ) pageSize = dataTotal.length;
    return new Product(dataTotal.length, pageIndex, pageSize, data);
};

exports.getById = async (id) => {
    const product = await db.Product.findAll({
        where: {
            id: id
        }
    });
    if (product == null) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: "Sản phẩm này không tồn tại !" })
    }
    return product;
};

exports.createOrUpdate = async (lstProduct) => {
    try {
        var response = [];
        var result = {};
        var lstCreate = [];
        var lstUpdate = [];
        var lstCategoryIdDuplicate = await lstProduct.map(x => x.categoryId);
        var listCategoryId = await lstCategoryIdDuplicate.filter(unique);
        const lstCategory = await db.Categories.findAll({ where: { id: listCategoryId } });
        for (var product of lstProduct) {
            try {
                await validateProduct(product);
            } catch (error) {
                result = new ProductResponse(product.title, error.message, CreateStatus.FAIL.value);
                response.push(result);
                continue;
            };
            let Category = lstCategory.filter(x => x.id == product.categoryId);
            if (Category.length == 0) {
                result = new ProductResponse(product.title, message, CreateStatus.FAIL.value);
                response.push(result);
                continue;
            }
            product.categoryName = Category[0].display;
            if (product.id) {
                const checkProductExist = await db.Product.findOne({ where: { id: product.id } });
                if (checkProductExist == null) {
                    result = new ProductResponse(product.title, "Sản phẩm không tồn tại !", CreateStatus.FAIL.value);
                    response.push(result);
                    continue;
                }
                lstUpdate.push(product);
                result = new ProductResponse(product.title, "Sửa sản phẩm thành công", CreateStatus.SUCCESS.value);
                response.push(result);
                continue;
            } else {
                lstCreate.push(product);
                result = new ProductResponse(product.title, "Thêm sản phẩm thành công", CreateStatus.SUCCESS.value);
                response.push(result);
                continue;
            }
        }
        if (lstCreate.length > 0) {
            db.Products.bulkCreate(lstCreate);
        }
        if (lstUpdate.length > 0) {
            db.Products.bulkCreate(lstUpdate, { updateOnDuplicate: ["title", "image01", "image03", "image03", "price", "desc", "categoryId", "categoryName"] });
        }
        return response;
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: error });
    }
};

exports.delete = async (lstId) => {
    try {
        var response = [];
        var result = {};
        var lstProduct = await db.Products.findAll({ where: { id: lstId, deleted: false } });
        for (var id of lstId) {
            let product = lstProduct.filter(x => x.id == id);
            if (product.length == 0) {
                result = new ProductResponse("", `Sản phẩm có id = ${id} không tồn tại !`, CreateStatus.FAIL.value);
                response.push(result);
                continue;
            }
            result = new ProductResponse(product[0].title, "Xóa sản phẩm thành công ", CreateStatus.SUCCESS.value);
            response.push(result);
        }
        await db.Products.update({ "deleted": true }, {
            where: {
                id: lstId
            }
        });
        return response;
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: error });
    }
};
