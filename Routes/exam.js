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
route.post('/get_time',function(req,res){
    subjects.findOne({
        where : {
            sub_code : req.body.sub_code
        }
    }).then((sub)=>{
        if(sub){
            console.log("Subject Found");
            let msg = {
                status : "Success",
                date : sub.dataValues.date_of_exam,
                time : sub.dataValues.time_of_exam,
            }
            res.send(msg);
        }
        else{
            let msg ={
                status : "Failure"
            }
            res.send(msg);
        }
    });
});


//----------------------------- POST REQUEST FOR SCHEDULE EXAMINATION -----------------------------
route.post('/schedule',function(req,res){

    subjects.create({
        sub_code : req.body.sub_name,
        sub_name : req.body.sub_code,
        date_of_exam : req.body.date_of_exam,
        time_of_exam  : req.body.time_of_exam
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

function build_col(ques_list){
    return new Promise(function(resolve,reject){
        let col = [];
        col.push({
            header : "Username",
            key : "username",
            width : 25
        });
        ques_list.forEach((q)=>{
            let id = (q.dataValues).id;
            let obj = {
                header : id,
                key : id,
                width : 10
            }
            col.push(obj);
        })
        resolve(col);
    })
}

function buildSheet(sub_code,col){
    var newsubject_sheet = workbook.addWorksheet(sub_code);
    newsubject_sheet.columns = col;

    var filename = "Responses.xlsx";
    workbook.xlsx.writeFile(filename).then(()=>{
        // callback(null);
        console.log('Success');
    }).catch((err)=>{
        console.log(err);
    });
}


//-----------------------------POST REQUEST FOR FINALISE EXAM -----------------------------
route.post('/finalise',function(req,res){

    questions.findAll({
        where : {
            sub_code : req.body.sub_code
        }
    }).then((ques_list)=>{
        console.log(ques_list.length);

        build_col(ques_list)
        .then((col)=>{
            buildSheet(req.body.sub_code,col)
            res.send('Success');
        });
    });

});


//-----------------------------POST REQUEST FOR SUBMIT EXAM -----------------------------
route.post('/submit',function(req,res){

    let m = calculate_marks_store_responses_update_marks(req.body,req.user);
    //console.log("Marks Obtained = " + m);

    res.redirect('/student');

});

function calculate_marks_store_responses_update_marks(obj,student){
    // for(key in obj){
    //     console.log(key + " --> " + obj[key]);
    // } 
    let total_marks = 0;
    let user = student.username;
    let code = obj.sub_code;

    questions.findAll({
        where : {
            sub_code : code
        }
    }).then((data)=>{

        let new_row = {};
        new_row["username"] = user;

        data.forEach((q) => {
            console.log(q["id"] + "//" + q["answer"] + "//" + obj[q["id"]]);
            new_row[q["id"]] = obj[q["id"]];
            if(q["answer"] === obj[q["id"]]){
                total_marks+=1;
            }
        });

        //Add Responses to the Excel Sheet
        const worksheet = workbook.getWorksheet(code);
        worksheet.addRow(new_row);
        var filename = "Responses.xlsx";
        workbook.xlsx.writeFile(filename).then(()=>{
            // callback(null);
            console.log('Sheet Updated Successfully');
        }).catch((err)=>{
            console.log(err);
        });

        //Add Marks to Database
        total_marks*=4;
        console.log("Returning marks are ",total_marks)

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


