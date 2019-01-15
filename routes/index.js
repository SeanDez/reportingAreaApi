var express = require('express');
var router = express.Router();

const dbConfig = {
  operatorsAliases: false
};

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URI, dbConfig);
// const sequelize = new Sequelize(process.env.DB_URI);
sequelize.authenticate()
         .then(() => {
           console.log("sequelize connected to postgres");
         })
         .catch(error => console.log('error: ', error));


const TestModel = sequelize.define('testModel', {
  firstName : {
    type : Sequelize.STRING
  },
  lastName : {
    type : Sequelize.STRING
  }
});

TestModel.sync().then(() => {
  // create Table
  return TestModel.create({
    firstName : '2nd entry',
    lastName : 'lastN2ndEntry'
  });
});

TestModel.findAll().then(users => {
  console.log('displaying users: ', users)
});




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
