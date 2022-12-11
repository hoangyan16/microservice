const Enum = require('enum');

const CreateStatus = new Enum ({
    "SUCCESS": 1,
    "FAIL": 0
});

const ORDER_STATUS= new Enum({
    "CREATED": 1,
    "PURCHASED": 2,
    "SHIPPING":3,
    "DELIVERIED": 4
});

const EVENT_STATUS = new Enum({
    "CREATE":1,
    "UPDATE":2,
    "CHANGE_PASSWORD":3,
    "DELETE":4
})

module.exports ={
    CreateStatus, ORDER_STATUS,EVENT_STATUS
}