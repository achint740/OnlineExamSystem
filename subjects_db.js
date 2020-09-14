const Sequelize = require('sequelize');

const subjects = new Sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/subjects.db'
});

const subjectsdb = subjects.define('subjects',{
    sub_code : {
        type : Sequelize.STRING,
        allowNull : false
    },
    sub_name : {
        type : Sequelize.STRING,
    }
});

subjects.sync().then(()=>{
    console.log("Subjects Database Ready");
});

module.exports = {
    subjects,
    subjectsdb
};