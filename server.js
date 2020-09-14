const exp = require("express");
const app = exp();
const subjects = require('./subjects_db').subjectsdb;
const questions = require('./ques_db').quesdb;
const session = require('express-session');


//----------------------------------------------------------
app.use(exp.json())
app.use(exp.urlencoded({extended:true}))


//----------------------------- USE EXPRESS SESSION -----------------------------
app.use(session({
    secret : 'qwertyuiop',
    resave: false,
    saveUninitialized: true,
}));

//-----------------------------LOAD SITE ON REQUEST TO '/' -----------------------------
app.use('/',exp.static(__dirname + '/public'));


//----------------------------- POST REQUEST FOR ADD SUBJECT -----------------------------
app.post('/addsubject',function(req,res){

    subjects.create({
        sub_code : req.body.sub_name,
        sub_name : req.body.sub_code
    }).then((createdsubject)=>{
        res.send('Success');
    });

});


//-----------------------------POST REQUEST FOR ADD QUESTION -----------------------------
app.post('/addques',function(req,res){
   
    questions.create({
        sub_code : req.body.sub_code,
        question : req.body.ques,
        option1 : req.body.op1,
        option2 : req.body.op2,
        option3 : req.body.op3,
        option4 : req.body.op4,
        answer : req.body.ans
    }).then((createdQues)=>{
        res.send('Success');
    });

});

//-----------------------------GET REQUEST FOR VIEW QUESTION -----------------------------
app.post('/viewexam',function(req,res){

    questions.findAll({
        where : {
            sub_code : req.body.sub_code
        } 
    }).then((val)=>{
        res.send(val);
    });
})


//-----------------------------SERVER START -----------------------------
app.listen(1001,()=>{
    console.log('Server started');
});