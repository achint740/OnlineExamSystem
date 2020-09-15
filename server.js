const exp = require("express");
const app = exp();
const subjects = require('./subjects_db').subjectsdb;
const questions = require('./ques_db').quesdb;
const users = require('./Users_db').Users;
const passport = require('./passport');
const session = require('express-session');
const { Users } = require("./Users_db");


//----------------------------------------------------------
app.use(exp.json())
app.use(exp.urlencoded({extended:true}))


//----------------------------- USE EXPRESS SESSION -----------------------------
app.use(session({
    secret : 'qwertyuiop',
    resave: false,
    saveUninitialized: true,
}));


//----------------------------- INITIALIZE PASSPORT -----------------------------
app.use(passport.initialize());
app.use(passport.session());


//-----------------------------LOAD SITE ON REQUEST TO '/' -----------------------------
app.use('/',exp.static(__dirname + '/public'));


//-----------------------------LOAD SITE ON REQUEST TO '/teacher' -----------------------------
app.use('/teacher',exp.static(__dirname + '/public/Teachers'));


//-----------------------------LOAD SITE ON REQUEST TO '/admin' -----------------------------
app.use('/admin',exp.static(__dirname + '/public/Admin'));


//-----------------------------LOAD SITE ON REQUEST TO '/student' -----------------------------
app.use('/student',exp.static(__dirname + '/public/Student'));


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


//----------------------------- POST REQUEST FOR LOGIN -----------------------------
app.post('/signup',(req,res)=>{
    users.create({
        username : req.body.username,
        password : req.body.password
    }).then((createdUser)=>{
        console.log('User created Successfully');
        res.redirect('/login');
    });
});


//----------------------------- POST REQUEST FOR LOGIN -----------------------------
app.post('/login',passport.authenticate('local',{failureRedirect : '/login'}),function(req,res){
    return res.redirect('/' + req.user.category);
});


//-----------------------------SERVER START -----------------------------
app.listen(1001,()=>{
    console.log('Server started');
});