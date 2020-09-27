const exp = require("express");
const app = exp();
const subjects = require('./subjects_db').subjectsdb;
const questions = require('./ques_db').quesdb;
const users = require('./Users_db').Users;
const marks = require('./Marks').marksdb;
const passport = require('./passport');
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


//-----------------------------LOAD SITE ON REQUEST TO '/successques' -----------------------------
app.use('/successques',exp.static(__dirname + '/public/Exam_Module/Ques_Success'));


//-----------------------------LOAD SITE ON REQUEST TO '/login' -----------------------------
app.use('/login',exp.static(__dirname + '/public/Login'));


//----------------------------- POST REQUEST FOR ADD SUBJECT -----------------------------
app.post('/addsubject',function(req,res){

    subjects.create({
        sub_code : req.body.sub_name,
        sub_name : req.body.sub_code,
        date_of_exam : req.body.date_of_exam
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
        res.redirect('/successques');
    });

});


//-----------------------------POST REQUEST FOR UPDATE QUESTION -----------------------------
app.post('/updateques',function(req,res){
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


//-----------------------------POST REQUEST FOR VIEW QUESTION -----------------------------
app.post('/deleteques',function(req,res){
    questions.destroy({
        where : {
            id : req.body.id,
            sub_code : req.body.sub_code
        }
    });
    res.send('Success');
});


//-----------------------------POST REQUEST FOR VIEW QUESTION -----------------------------
app.post('/viewexam',function(req,res){

    questions.findAll({
        where : {
            sub_code : req.body.sub_code
        } 
    }).then((val)=>{
        res.send(val);
    });
});


//-----------------------------POST REQUEST FOR VIEW QUESTION -----------------------------
app.post('/markslist',function(req,res){

    marks.findAll({
        where : {
            sub_code : req.body.sub_code
        } 
    }).then((val)=>{
        res.send(val);
    });
});


//-----------------------------POST REQUEST FOR CHECK ATTEMPT -----------------------------
app.post('/checkattempt',function(req,res){
    marks.findOne({
        where : {
            sub_code : req.body.sub_code,
            username : req.user.username
        }
    }).then((val)=>{
        if(val){
            res.send("Yes");
        }
        else{
            res.send("No");
        }
    })
})


//-----------------------------POST REQUEST FOR SUBMIT EXAM -----------------------------
app.post('/submitexam',function(req,res){

    let m = calculate_and_update_marks(req.body,req.user);
    //console.log("Marks Obtained = " + m);

    res.redirect('/student');

});


//-----------------------------POST REQUEST FOR SUBMIT EXAM -----------------------------
app.post('/changemarks',function(req,res) {
    let msg = 'Failure';
    marks.findOne({
        where : {sub_code : req.body.sub_code,username : req.body.username}
    }).then((record)=>{
            if(record){
                msg = 'Success';
                record.update({
                    marks_given : req.body.newmarks
                })
            }
            else{
                //No Such Record Found
            }
            res.send(msg);
        });
});


//----------------------------- POST REQUEST FOR SIGN UP -----------------------------
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


//----------------------------- GET REQUEST FOR PROFILE -----------------------------
app.get('/profile',function(req,res){
    res.send(req.user);
});


//----------------------------- GET REQUEST FOR LOGOUT -----------------------------
app.get('/logout',function(req,res){
    console.log("Logging Out " + req.user.username);
    req.logout();
    res.send('Success');
});


//-----------------------------SERVER START -----------------------------
app.listen(1001,()=>{
    console.log('Server started at http://localhost:1001/');
});

function calculate_and_update_marks(obj,student){
    // for(key in obj){
    //     console.log(key + " --> " + obj[key]);
    // } 
    let total_marks = 0;

    questions.findAll({
        where : {
            sub_code : obj.sub_code
        }
    }).then((data)=>{
        data.forEach((q) => {
            console.log(q["id"] + "//" + q["answer"] + "//" + obj[q["id"]]);
            if(q["answer"] === obj[q["id"]]){
                total_marks+=1;
            }
        });
        total_marks*=4;
        console.log("Returning marks are ",total_marks)
        let user = student.username;
        let code = obj.sub_code;

        marks.create({
            sub_code : code,
            username : user,
            marks_given : total_marks
        }).then((info)=>{
            console.log('Exam Attempted Successfully!');
            console.log("Marks Alloted : " + total_marks + " For Roll No. " + user);
        });
        return total_marks;

    });
}