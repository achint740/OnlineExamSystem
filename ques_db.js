const Sequelize = require('sequelize');

const questions = new Sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/ques.db'
});

const quesdb = questions.define('ques',{
    sub_code : {
        type : Sequelize.STRING,
        allowNull : false
    },
    ques_no : {
        type : Sequelize.INTEGER,
        allowNull : true
    },
    question : {
        type : Sequelize.STRING,
        allowNull : false
    },
    option1 : {
        type : Sequelize.STRING,
        allowNull : false
    },
    option2 : {
        type : Sequelize.STRING,
        allowNull : false
    },
    option3 : {
        type : Sequelize.STRING,
        allowNull : false
    },
    option4 : {
        type : Sequelize.STRING,
        allowNull : false
    },
    answer : {
        type : Sequelize.STRING,
        allowNull : false
    }
});

questions.sync().then(()=>{
    console.log("Questions Database Ready");
});

module.exports = {
    questions,
    quesdb
}