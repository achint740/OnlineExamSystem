const Sequelize = require('sequelize');

const usersdb = new Sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/datauser.db',
});

const Users = usersdb.define('users',{
    username : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false
    },
    category : {
        type : Sequelize.STRING,
        allowNull : false
    }
});

usersdb.sync().then(()=>{
    console.log('Users Database Ready!!');
});

module.exports = {
    usersdb,
    Users
}