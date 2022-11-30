const express = require("express");
const sequelize = require("./db");
const User = require("./models/user");

const app = express();

app.get("/", function (req, res) {
  res.send("Hello Arman");
});

app.post("/", function (req, res) {
  res.send("Hello Arman");
});

const init = () => {
  sequelize
    .authenticate()
    .then(() => {
      // check connection to database
      console.log("Connection has been established successfully!");
      User.sync({ alter: true }); // force all changes to be made on the database
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
};

//for test
const jwt = require('jsonwebtoken');
jwt.sign({ user: 'xxx' }, 'Arman', { expiresIn: 3600 }, function(err, token) {
  console.log(token);
  let test = jwt.verify(token,'Arman');
  console.log(test);
});

app.listen(4000);
