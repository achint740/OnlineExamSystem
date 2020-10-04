const exp = require("express");
const app = exp();
const session = require('express-session');
const exam = require('./Routes/exam').route;
const users = require('./Routes/users').route;
const ques = require('./Routes/ques').route;
const marks = require('./Routes/marks').route;


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


//-----------------------------LOAD SITE ON REQUEST TO '/teacher' -----------------------------
app.use('/teacher',exp.static(__dirname + '/public/Teachers'));


//-----------------------------LOAD SITE ON REQUEST TO '/admin' -----------------------------
app.use('/admin',exp.static(__dirname + '/public/Admin'));


//-----------------------------LOAD SITE ON REQUEST TO '/student' -----------------------------
app.use('/student',exp.static(__dirname + '/public/Student'));


//-----------------------------LOAD SITE ON REQUEST TO '/successques' -----------------------------
app.use('/successques',exp.static(__dirname + '/public/Exam_Module/Questions'));


//-----------------------------LOAD SITE ON REQUEST TO '/login' -----------------------------
app.use('/login',exp.static(__dirname + '/public/Login'));


//----------------------------- ROUTES -----------------------------
app.use('/exam',exam);
app.use('/marks',marks);
app.use('/users',users);
app.use('/ques',ques);


//-----------------------------SERVER START -----------------------------
app.listen(1001,()=>{
    console.log('Server started at http://localhost:1001/');
});
