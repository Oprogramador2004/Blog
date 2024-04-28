const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users',{
   email: {
        type: Sequelize.STRING,
    allownull: false
},password: {
    type: Sequelize.STRING,
    allownull:false
}
})

User.sync({force:true});

module.exports = User;