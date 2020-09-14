const exp = require("express");
const app = exp();
const subjects = require('./subjects_db').subjectsdb;
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

app.post('/addsubject',function(req,res){
    let name = req.body.sub_name;
    let code = req.body.sub_code;

    subjects.create({
        sub_code : code,
        sub_name : name
    }).then((createdsubject)=>{
        res.send('Success');
    });

});

app.listen(1001,()=>{
    console.log('Server started');
});