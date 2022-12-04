const express = require('express');
const cors  = require('cors');
const path = require('path');
const route = require('./api/routes')
const { CreateChannel } = require('./utils/rabbitMQ');
const {user} = require('./api/controllers');

module.exports = async (app) => {
    
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    
    //api
    // appEvents(app);
    
    const channel = await CreateChannel()
    
    user(app, channel);
    app.use(route);
    // error handling
    
}
