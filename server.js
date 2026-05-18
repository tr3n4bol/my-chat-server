const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const dbconfig = require("./config/dbConfig");

const port = process.env.PORT_NUMBER || 8080;

app.listen(port, () => console.log(`Listening to requests on port: ${port}`));
