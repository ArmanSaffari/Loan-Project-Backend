const express = require('express');
const app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  'Loan_db',
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

 // check connection to database
sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully!');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

//create Models
const User = sequelize.define('User',{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  personnelCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nationalCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  employmentStatus: {
    type: DataTypes.STRING,
  },
  homeAddress: {
    type: DataTypes.STRING,
  },
  zipCode: {
    type: DataTypes.STRING
  },
  phoneNumber: {
    type: DataTypes.INTEGER
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isActiveUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  membershipDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  UserPictureAddress: {
    type: DataTypes.STRING
  }
},{});

User.sync({alter: true}) // force all changes to be made on the database
//create APIs

app.get('/', function (req, res) {
  res.send('Hello Arman')
})


app.post('/', function (req, res) {
    res.send('Hello Arman')
  })

app.listen(4000)