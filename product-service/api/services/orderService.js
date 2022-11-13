const db = require("../../models/index");
const { ErrorCodes } = require("../constants/HTTPResponse");
const { CreateStatus, ORDER_STATUS } = require('../constants/Enum');
const { validateOrder } = require('../../dtos/orderCreateOrUpdateDto');
const { unique } = require('../utils/removeDuplicateItem');
const OrderResponse = require('../../dtos/createOrUpdateOrderResponseDto');
const ProductResponse = require('../../dtos/createOrUpdateProductResponseDto');
exports.getByConditions = () => {
    let condition = {
        deleted: false
    }
    return db.Orders.findAll({
        where: condition
    });
};

exports.getById = async (id) => {
    const order = await db.Orders.findAll(
        {
            where: {
                id: id
            }
        }
    );
    if (order == null) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: "Sản phẩm này không tồn tại !" })
    }
    return order;
};

exports.createOrUpdate = async (lstOrder, username) => {
    try {
        var response = [];
        var result = {};
        var lstUpdate = [];
        var lstCreate = [];
        var lstProductIdDuplicates = await lstOrder.map(x => x.productId);
        var lstProductId = await lstProductIdDuplicates.filter(unique);
        var lstProductDb = await db.Products.findAll({ where: { id: lstProductId } });
        const userDb = await db.Users.findOne({ where: { username: username } });
        if (userDb == null) {
            return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: 'Người dùng không tồn tại ! ' });
        }
        for (var order of lstOrder) {
            try {
                await validateOrder(order);
            } catch (error) {
                result = new OrderResponse("", error.message, CreateStatus.FAIL.value);
                response.push(result);
                continue;
            }
            let checkProductExist = lstProductDb.filter(x => x.id == order.productId);
            if (checkProductExist.length == 0) {
                result = new ProductResponse(order.id, `Sản phẩm có ${order.productId} không tồn tại !`, CreateStatus.FAIL.value);
                response.push(result);
                continue;
            }
            order.userId = userDb.id;
            order.status = ORDER_STATUS.CREATED.value;
            order.price = parseInt(checkProductExist[0].price) * parseInt(order.quantity);
            order.productName = checkProductExist[0].title;
            if (order.id) {
                const checkProductExist = await db.Orders.findOne({ where: { id: order.id, userId: order.userId } });
                if (checkProductExist == null) {
                    result = new OrderResponse(order.id, `Đơn hàng có mã ${order.id} không tồn tại !`, CreateStatus.FAIL.value);
                    response.push(result);
                    continue;
                }
                lstUpdate.push(order);
                result = new OrderResponse(order.id, `Cập nhật đơn hàng thành công !`, CreateStatus.SUCCESS.value);
                response.push(result);
                continue;
            } else {
                lstCreate.push(order);
                result = new OrderResponse(order.id, "Tạo đơn hàng thành công !", CreateStatus.SUCCESS.value);
                response.push(result);
                continue;
            }
        }
        if (lstUpdate.length > 0) {
            db.Orders.bulkCreate(lstUpdate, { updateOnDuplicate: ["productId", "quantity", "productName"] });
        }
        if (lstCreate.length > 0) {
            db.Orders.bulkCreate(lstCreate);
        }
        return response;
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};

exports.delete = async (lstId) => {
    try {
        return db.Orders.update({ "deleted": true }, {
            where: {
                id: lstId
            }
        });
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};
