const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
// const swaggerUi = require('swagger-ui-express')
// const swaggerFile = require('./swagger-output.json');
// const {minioClient}= require('./api/helper/minIO');

app.use(cors());
require("dotenv").config();
const port = process.env.PORT;
const route = require("./api/routes");
const { sequelize } = require("./models");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Enable CORS from client-side
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(morgan("combined"));
app.use(route);
// app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get("/", async (req, res, next) => {
    res.send("Welcome to User-Service");
});

app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`);
    try {
        await sequelize.authenticate();
        // await minioClient.bucketExists("order-app");
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});