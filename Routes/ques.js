const route = require('express').Router(); 
const questions = require('../db').quesDB;
const subjects = require('../db').subjectsDB;

//-----------------------------POST REQUEST FOR ADD QUESTION -----------------------------
route.post('/add',function(req,res){

    subjects.findOne({
        where : {sub_code : req.body.sub_code}
    }).then((sub)=>{
        if(sub && (sub.dataValues.exam_status == 1)){
            console.log('Exam Locked');
            res.send("Exam Locked");
        }
        else{
            console.log("Creating Question ... ")
            questions.create({
                sub_code : req.body.sub_code,
                question : req.body.ques,
                option1 : req.body.op1,
                option2 : req.body.op2,
                option3 : req.body.op3,
                option4 : req.body.op4,
                answer : req.body.ans
            })
            .then((createdQues)=>{
                console.log("Question Created : " + createdQues);
                res.send('Success')
            })
            .catch((err)=>{
                console.log("Error Occured : " + err);
                res.send('Failure')
            })
        }
    });
});

//-----------------------------POST REQUEST FOR UPDATE QUESTION -----------------------------
route.post('/update',function(req,res){

    questions.findOne({
        where : {
            sub_code : req.body.sub_code,
            id : req.body.id
        }
    }).then((ques)=>{
        if(ques){
            msg = 'Success';
            ques.update({
                question : req.body.question,
                option1 : req.body.option1,
                option2 : req.body.option2,
                option3 : req.body.option3,
                option4 : req.body.option4,
                answer : req.body.answer
            })
            .then((updatedQues)=>{
                console.log('Question Updated!' + updatedQues.dataValues.question);
                res.send('Update Successfull');
            })
            .catch((err)=>{
                console.log('Error Occured ' + err);
                res.send('Failed to Update! ERROR');
            })
        }
        else{
            res.send('Question not found in database! Consistency error');
        }
    });
});


//-----------------------------POST REQUEST FOR DELETE QUESTION -----------------------------
route.post('/delete',function(req,res){
    questions.destroy({
        where : {
            id : req.body.id,
            sub_code : req.body.sub_code
        }
    })
    .then((deletedQues)=>{
        console.log('Question Deleted!');
        res.send('Success');
    })
    .catch((err)=>{
        console.log('Error Occured ' + err);
        res.send('Failed to delete! ERROR');
    });
});

module.exports = {
    route
}