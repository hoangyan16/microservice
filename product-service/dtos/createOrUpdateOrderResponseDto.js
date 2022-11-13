Product = {
    title : String,
    message: String,
    status: Int8Array
}
var Product = function(id,message,status){
    this.orderId = id;
    this.message = message;
    this.status = status;
}
module.exports =  Product;