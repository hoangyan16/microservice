Product = {
    title : String,
    message: String,
    status: Int8Array
}
var Product = function(title,message,status){
    this.title = title;
    this.message = message;
    this.status = status;
}
module.exports =  Product;