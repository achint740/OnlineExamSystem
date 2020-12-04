const route = require('express').Router();
const users = require('../db').usersDB;
const marks = require('../db').marksDB;
const subjects = require('../db').subjectsDB;
const passport = require('../passport');


//----------------------------- INITIALIZE PASSPORT -----------------------------
route.use(passport.initialize());
route.use(passport.session());


//-----------------------------POST REQUEST FOR VIEW MARKS LIST -----------------------------
route.post('/list',function(req,res){
    if(!req.user){
        res.redirect('/login');
    }
    marks.findAll({
        where : {
            sub_code : req.body.sub_code
        } 
    })
    .then((markslist)=>{
        console.log('Sending Markslist');
        res.send(markslist);
    })
    .catch((err)=>{
        console.log('Error Occured ' + err);
        res.send([]);
    });
});


//-----------------------------POST REQUEST FOR VIEW MARKS -----------------------------
route.post('/my',function(req,res){
    if(!req.user){
        res.redirect('/login');
    }
    marks.findOne({
        where : {
            sub_code : req.body.sub_code,
            username : req.user.username
        }
    })
    .then((mymarks)=>{
        if(mymarks){
            subjects.findOne({
                where : {
                    sub_code : req.body.sub_code
                }
            }).then((subject_info)=>{
                res.send({
                    marks : mymarks.dataValues.marks_given,
                    username : req.user.username,
                    max_marks : +(subject_info.dataValues.ques_cnt)
                });
            });
        }
        else{
            res.send('Not Attempted!');
        }
    })
})

//-----------------------------POST REQUEST FOR CHANGE MARKS -----------------------------
route.post('/change',function(req,res) {
    if(!req.user){
        res.redirect('/login');
    }
    let msg = 'Failure';
    marks.findOne({
        where : {sub_code : req.body.sub_code,username : req.body.username}
    })
    .then((record)=>{
        if(record){
            console.log("Found! Updating ...");
            msg = 'Success';
            record.update({
                marks_given : req.body.newmarks
            })
        }
        else{
            console.log("No such record found");
        }
        res.send(msg);
    })
    .catch((err)=>{
        console.log('Error Occured ' + err);
        res.send('Failure');
    })
});


//-----------------------------POST REQUEST FOR CHECK ATTEMPT -----------------------------
route.post('/checkattempt',function(req,res){
    if(!req.user){
        res.redirect('/login');
    }
    marks.findOne({
        where : {
            sub_code : req.body.sub_code,
            username : req.user.username
        }
    })
    .then((val)=>{
        if(val){
            console.log("Entry Found! ALready Attempted");
            res.send("Yes");
        }
        else{
            console.log("Entry Not Found! Can Attempt");
            res.send("No");
        }
    })
    .catch((err)=>{
        console.log('Error Occured ' + err);
        res.send('Error');
    })
});

module.exports = {
    route
}