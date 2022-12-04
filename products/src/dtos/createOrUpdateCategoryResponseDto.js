Category = {
    display : String,
    message: String,
    status: Int8Array
}
var Category = function(display,message,status){
    this.title = display;
    this.message = message;
    this.status = status;
}
module.exports =  Category;