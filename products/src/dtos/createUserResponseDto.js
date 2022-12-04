User = {
    display : String,
    message: String,
    status: Int8Array
}
var User = function(title,message,status){
    this.title = title;
    this.message = message;
    this.status = status;
}
module.exports =  User;