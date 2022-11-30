const db = require("../../models/index");
const { ErrorCodes } = require("../constants/HTTPResponse");
const { CreateStatus } = require('../constants/Enum');
const Category = require('../../dtos/createOrUpdateCategoryResponseDto');

exports.getByConditions = (query) => {
    let condition = {
        deleted: false
    };
    return db.Categories.findAndCountAll({
        where: condition,
    });
};

exports.getById = async (id) => {
    const category = await db.Categories.findAll(
        {
            where: {
                id: id
            }
        }
    );
    if (category == null) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: "Sản phẩm này không tồn tại !" })
    }
    return category;
};

exports.createOrUpdate = async (lstCategory) => {
    try {
        var response = [];
        var result = {};
        var lstCreate = [];
        var lstUpdate = [];
        for (var category of lstCategory) {
            if (category.id) {
                const checkCategoriesExist = await db.Categories.findOne({ where: { id: category.id } });
                if (checkCategoriesExist == null) {
                    return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: "Sản phẩm không tồn tại !", status: CreateStatus.FAIL.value });
                }
                lstUpdate.push(category);
                result = new Category(category.display, "Sửa loại sản phẩm thành công", CreateStatus.SUCCESS.value);
                response.push(result);
                continue;
            } else {
                lstCreate.push(category);
                result = new Category(category.display, "Thêm loại sản phẩm thành công", CreateStatus.SUCCESS.value);
                response.push(result);
                continue;
            }
        }
        if (lstCreate.length > 0) {
            await db.Categories.bulkCreate(lstCreate);
        }
        if (lstUpdate.length > 0) {
            await db.Categories.bulkCreate(lstUpdate, { updateOnDuplicate: ["display", "imgUrl"] });
        }
        return response;
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};

exports.delete = async (lstId) => {
    try {
        var response = [];
        var result = {};
        const lstCategory = await db.Categories.findAll({ where: { id: lstId, deleted: false } });
        for (var categoryId of lstId) {
            let category = lstCategory.filter(x => x.id == categoryId);
            if (category.length == 0) {
                result = new Category("", `Loại sản phẩm có id = ${categoryId} không tồn tại !`,CreateStatus.FAIL.value);
                response.push(result);
                continue;
            }
            result = new Category(category[0].display, "Xóa loại sản phẩm thành công ", CreateStatus.SUCCESS.value);
            response.push(result);
        }
        await db.Categories.update({ "deleted": true }, {
            where: {
                id: lstId
            }
        });
        return response;
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: error });
    }
};
