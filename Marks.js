const Sequelize = require('sequelize');

const marks = new Sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/marks.db'
});

const marksdb = marks.define('mark',{
    sub_code : {
        type : Sequelize.STRING,
        allowNull : false
    },
    username : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    marks_given : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
});

marks.sync().then(()=>{
    console.log("Marks Database Ready");
});

module.exports = {
    marks,
    marksdb
}