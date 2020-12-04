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


//----------------------------- POST REQUEST FOR GET EXAMINATION SCHEDULE-----------------------------
route.post('/get_time',function(req,res){
    if(!req.user){
        return res.redirect('/login');
    }
    subjects.findOne({
        where : {
            sub_code : req.body.sub_code
        }
    }).then((sub)=>{
        if(sub){
            console.log("Subject Found");
            let final = sub.dataValues.exam_status;
            if(final==1){
                let msg = {
                    status : "Success",
                    date : sub.dataValues.date_of_exam,
                    time : sub.dataValues.time_of_exam,
                    duration : sub.dataValues.exam_duration
                }
                res.send(msg);
            }
            else{
                console.log('Subject Not finalised!');
                let msg = {
                    status : "Failure"
                }
                res.send(msg);
            }
        }
        else{
            console.log("Subject Not Found");
            let msg ={
                status : "Failure"
            }
            res.send(msg);
        }
    });
});


//----------------------------- POST REQUEST FOR GET EXAMINATION STATUS-----------------------------
route.post('/lock',function(req,res){
    if(!req.user){
        return res.redirect('/login');
    }
    let obj = {
        status : 0
    };
    subjects.findOne({
        where : {
            sub_code : req.body.sub_code
        }
    }).then((sub)=>{
        if(sub && sub.dataValues.exam_status){
            obj.status = 1;
            res.send(obj); 
        }
        else{
            res.send(obj);
        }
    });
})


//----------------------------- POST REQUEST FOR SCHEDULE EXAMINATION -----------------------------
route.post('/schedule',function(req,res){
    if(!req.user){
        return res.redirect('/login');
    }
    subjects.create({
        sub_code : req.body.sub_code,
        sub_name : req.body.sub_name,
        date_of_exam : req.body.date_of_exam,
        time_of_exam  : req.body.time_of_exam,
        exam_duration : req.body.duration
    })
    .then((createdSubject)=>{
        console.log("Subject Created Successfully!" + createdSubject);
        res.send('Success');
    })
    .catch((err)=>{
        console.log("Error! Couldn't insert!! " + err);
        res.send('Failure');
    });

});


//----------------------------- POST REQUEST FOR VIEW EXAMINATION -----------------------------
route.post('/view',function(req,res){
    if(!req.user){
        return res.redirect('/login');
    }
    questions.findAll({
        where : {
            sub_code : req.body.sub_code
        } 
    })
    .then((ques_list)=>{
        console.log('Questions found! Sending List ...');
        res.send(ques_list);
    })
    .catch((err)=>{
        console.log('Error Occured' + err);
        res.send('Failure');
    })
});

function build_col(ques_list){
    return new Promise(function(resolve,reject){
        let col = [];
        col.push({
            header : "Username",
            key : "username",
            width : 25
        });
        col.push({
            header : "Timestamp",
            key : "time_submit",
            width : 40
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
        console.log('Success! Sheet Created');
    }).catch((err)=>{
        console.log(err);
    });
}


//-----------------------------POST REQUEST FOR FINALISE EXAM -----------------------------
route.post('/finalise',function(req,res){
    if(!req.user){
        res.redirect('/login');
    }
    questions.findAll({
        where : {
            sub_code : req.body.sub_code
        }
    })
    .then((ques_list)=>{
        console.log("No. of questions : " + ques_list.length);
        
        subjects.update(
            {ques_cnt : ques_list.length,
            exam_status : 1},
            {where : { sub_code : req.body.sub_code}}
        )
        .then((rowUpdated)=>{
            console.log("Exam Status Updated " + rowUpdated);
            build_col(ques_list).then((col)=>{
                buildSheet(req.body.sub_code,col)
                res.send('Success');
            });
        })
        .catch((err)=>{
            console.log("Error Occured!! " + err);
            res.send('Failure');
        })

    })
    .catch((err)=>{
        console.log("Error Occured!! " + err);
        res.send('Failure');
    })

});


//-----------------------------POST REQUEST FOR SUBMIT EXAM -----------------------------
route.post('/submit',function(req,res){
    if(!req.user){
        res.redirect('/login');
    }
    calculate_marks_store_responses_update_marks(req.body,req.user);

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
        new_row["time_submit"] = new Date();
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

        workbook.xlsx.writeFile(filename)
        .then(()=>{
            console.log('Sheet Updated Successfully');
        })
        .catch((err)=>{
            console.log("Error Occured " + err);
        })

        //Add Marks to Database
        total_marks*=4;
        console.log("Returning marks are ",total_marks)

        marks.create({
            sub_code : code,
            username : user,
            marks_given : total_marks
        })
        .then((info)=>{
            console.log('Exam Attempted Successfully!' + info);
            console.log("Marks Alloted : " + total_marks + " For Roll No. " + user);
            return 1;
        })
        .catch((err)=>{
            console.log('Error Occured');
            return 0;
        })

    });
}

module.exports = {
    route
}


