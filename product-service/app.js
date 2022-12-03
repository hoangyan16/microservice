const express = require('express');
const cors  = require('cors');
const path = require('path');
const { CreateChannel } = require('./api/utils/rabbitMQ');
const route = require("./api/routes");
module.exports = async (app) => {
    
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    
    //api
    // appEvents(app);
    
    const channel = await CreateChannel()
    
    shopping(app, channel);
    app.use(route, channel);
    // error handling
    
}
