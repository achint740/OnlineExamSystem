const route = require('express').Router(); 
const questions = require('../db').quesDB;

//-----------------------------POST REQUEST FOR ADD QUESTION -----------------------------
route.post('/add',function(req,res){
   
    questions.create({
        sub_code : req.body.sub_code,
        question : req.body.ques,
        option1 : req.body.op1,
        option2 : req.body.op2,
        option3 : req.body.op3,
        option4 : req.body.op4,
        answer : req.body.ans
    }).then((createdQues)=>{
        console.log(createdQues);
        res.redirect('/successques');
    });

});

//-----------------------------POST REQUEST FOR UPDATE QUESTION -----------------------------
route.post('/update',function(req,res){
    let msg = 'Failure';
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
                option4 : req.body.option4
            })
        }
        else{
            //No Such Question Found
        }
        res.send(msg);
    })
});


//-----------------------------POST REQUEST FOR DELETE QUESTION -----------------------------
route.post('/delete',function(req,res){
    questions.destroy({
        where : {
            id : req.body.id,
            sub_code : req.body.sub_code
        }
    });
    res.send('Success');
});

module.exports = {
    route
}