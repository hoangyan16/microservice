const express = require('express');
const cors  = require('cors');
const { sequelize } = require("./models");
const { CreateChannel } = require('./utils/rabbitMQ');
const {user,appEvents} = require('./api/controllers');

module.exports = async (app) => {
    
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    
    try {
        await sequelize.authenticate();
        // await minioClient.bucketExists("order-app");
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    const channel = await CreateChannel();
    
    user(app, channel);
    
}
