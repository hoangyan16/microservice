const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const port = process.env.PORT;



const StartServer = async () => {
    const app = express();
    const appServer = require('./src');
    // Enable CORS from client-side
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-Control-Allow-Credentials");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    });

    app.use(morgan("combined"));
    // app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    app.get("/", async (req, res, next) => {
        res.send("Welcome to User-Service"); 
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    await appServer(app);
    app.listen(port, async () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}
StartServer();