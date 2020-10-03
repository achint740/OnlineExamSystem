const route = require('express').Router();
const subjects = require('../db').subjectsDB;
const questions = require('../db').quesDB;
const marks = require('../db').marksDB;
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const users = require('../db').usersDB;
const passport = require('../passport');


//----------------------------- INITIALIZE PASSPORT -----------------------------
route.use(passport.initialize());
route.use(passport.session());


//----------------------------- POST REQUEST FOR SCHEDULE EXAMINATION -----------------------------
route.post('/schedule',function(req,res){

    subjects.create({
        sub_code : req.body.sub_name,
        sub_name : req.body.sub_code,
        date_of_exam : req.body.date_of_exam
    }).then((createdsubject)=>{
        res.send('Success');
    });

});


//----------------------------- POST REQUEST FOR VIEW EXAMINATION -----------------------------
route.post('/view',function(req,res){

    questions.findAll({
        where : {
            sub_code : req.body.sub_code
        } 
    }).then((ques_list)=>{
        res.send(ques_list);
    });
});


//-----------------------------POST REQUEST FOR FINALISE EXAM -----------------------------
route.post('/finalise',function(req,res){

    let col = [];

    questions.findAll({
        where : {
            sub_code : req.body.sub_code
        }
    }).then((ques_list)=>{
        console.log(ques_list.length);
        ques_list.forEach((q)=>{
            let id = (q.dataValues).id;
            let obj = {
                header : id,
                key : id,
                width : 10
            }
            col.push(obj);
        })
    })

    var newsubject_sheet = workbook.addWorksheet(req.body.sub_code);
    newsubject_sheet.columns = col;

    var filename = "Responses.xlsx";
    workbook.xlsx.writeFile(filename).then(()=>{
        // callback(null);
        console.log('Success');
    }).catch((err)=>{
        console.log(err);
    });


});


//-----------------------------POST REQUEST FOR SUBMIT EXAM -----------------------------
route.post('/submit',function(req,res){

    let m = calculate_and_update_marks(req.body,req.user);
    //console.log("Marks Obtained = " + m);

    res.redirect('/student');

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

module.exports = {
    route
}


