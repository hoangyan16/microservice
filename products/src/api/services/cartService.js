const db = require("../../models/index");
const { ErrorCodes } = require("../constants/HTTPResponse");
const { CreateStatus,ORDER_STATUS } = require('../constants/Enum');

exports.getByConditions = async (username, query) => {
    try {
        const userDB = await db.Users.findOne({ where: { username: username } });
        if (userDB == null) {
            return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: 'Người dùng không tồn tại ! ' });
        }
        const userId = userDB.id;
        let cart = await db.Carts.findOne({ where: { userId: userId, status: ORDER_STATUS.CREATED.value } });
        if (cart == null) {
            cart = {
                userId: userId,
                product: "",
                status: ORDER_STATUS.CREATED.value,
                subPrice: 0
            };
            const orders = await db.Orders.findAll({ where: { userId: userId, status: ORDER_STATUS.CREATED.value },attributes:["id","productName","productId","price","status"]});
            if (orders.length == 0) {
                return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: 'Giỏ hàng trống , hãy mua hàng !' });
            }
            for (var order of orders) {
                cart.totalPrice += parseInt(order.price);
            }
            cart.product =JSON.stringify(orders);
            await db.Carts.create(cart);
            cart = await db.Carts.findOne({ where: { userId: userId } ,attributes:["id","userId","product","subPrice","status"]});
            cart.product= JSON.parse(cart.product);
            return cart;
        } else {
            const orders = await db.Orders.findAll({ where: { userId: userId, status: ORDER_STATUS.CREATED.value }, attributes:["id","productName","productId","price","status"]});
            cart.subPrice = 0;
            for (var order of orders) {    
                cart.subPrice += parseInt(order.price);
            }
            const updateCart = {
                product : JSON.stringify(orders),
                subPrice: cart.subPrice
            }
            await db.Carts.update(updateCart,{
                where:
                {
                    userId: userId
                }
            });
            cart = await db.Carts.findOne({ where: { userId: userId, status: ORDER_STATUS.CREATED.value },attributes:["id","userId","product","subPrice","status"] });
            cart.product= JSON.parse(cart.product);
            return cart;
        }
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};

exports.checkOut = async (cartInfo) => {
    const cart = await db.Carts.findOne(
        {
            where: {
                id: cartInfo.orderId,
                status:ORDER_STATUS.CREATED.value
            }
        }
    );
    if (cart == null) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: "Đơn hàng này không tồn tại !" })
    }
    cartInfo.totalPrice = parseInt(cartInfo.shipping) +  parseInt(cart.subPrice);
    return db.Carts.update(cartInfo, {where:{id: cart.id} });
};

exports.getById = async (id) => {
    const cart = await db.Carts.findOne(
        {
            where: {
                id: id
            }
        }
    );
    if (cart == null) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: "Đơn hàng này không tồn tại !" })
    }
    return cart;
};

exports.createOrUpdate = async (cart) => {
    try {
        var response = {};
        if (cart.id) {
            const checkcartExist = await db.Carts.findOne({ where: { id: cart.id } });
            if (checkcartExist == null) {
                return Promise.reject({ error: ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, message: "Sản phẩm không tồn tại !", status: CreateStatus.FAIL.value });
            }
            await db.Carts.update(cart, { where: { id: cart.id } });
            response = new cart(cart.title, "Sửa sản phẩm thành công", CreateStatus.SUCCESS.value);
        } else {
            await db.Carts.create(cart);
            response = new cart(cart.title, "Thêm sản phẩm thành công", CreateStatus.SUCCESS.value);
        }
        return response;
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};

exports.delete = async (lstId) => {
    try {
        return db.Carts.update({ "deleted": true }, {
            where: {
                id: lstId
            }
        });
    } catch (error) {
        return Promise.reject({ error: ErrorCodes.ERROR_CODE_SYSTEM_ERROR, message: 'error' });
    }
};
