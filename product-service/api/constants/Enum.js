const Enum = require('enum');

const CreateStatus = new Enum ({
    "SUCCESS": 1,
    "FAIL": 0
});

const ORDER_STATUS= new Enum({
    "CREATED": 1,
    "SHOP_COMFIRM": 2,
    "SHIPPING":3,
    "DELIVERIED": 4
});

const EVENTSTATUS = new Enum({
    "CREATE":1,
    "UPDATE":2,
})
module.exports ={
    CreateStatus, ORDER_STATUS,EVENTSTATUS
}