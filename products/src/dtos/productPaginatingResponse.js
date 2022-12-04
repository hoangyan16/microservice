Product = {
    total : Number,
    pageNumber: Number,
    pageSize: Number,
    data: Array
}
var Product = function(total,pageNumber,pageSize,data){
    console.log(total);
    this.total = total;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.data = data
}
module.exports =  Product;