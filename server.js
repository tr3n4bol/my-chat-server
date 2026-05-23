const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const server = require("./app");
const dbconfig = require("./config/dbConfig");

const port = process.env.PORT_NUMBER || 8080;

server.listen(port, () =>
    console.log(`Listening to requests on port: ${port}`),
);
