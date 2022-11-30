require("dotenv").config();

const sequelize = require("./configs/db");
const syncTables = require("./configs/sync");
const routes = require("./routes");

const env = process.env;
const express = require("express");
const app = express();
app.use(express.json());
app.use("/api", routes);
app.get("/", (req, res) => {
  res.send("hi 34");
});

const init = async () => {
  try {
    await sequelize.authenticate();
    await syncTables();
    console.log(`listening on http://localhost:${env.APP_PORT} successfully!`);
    console.log("Connection has been established successfully!");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
};

app.listen(env.APP_PORT, init);
