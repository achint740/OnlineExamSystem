const route = require('express').Router();
const users = require('../db').usersDB;
const marks = require('../db').marksDB;
const passport = require('../passport');


//----------------------------- INITIALIZE PASSPORT -----------------------------
route.use(passport.initialize());
route.use(passport.session());


//-----------------------------POST REQUEST FOR VIEW MARKS LIST -----------------------------
route.post('/list',function(req,res){

    marks.findAll({
        where : {
            sub_code : req.body.sub_code
        } 
    }).then((markslist)=>{
        res.send(markslist);
    });
});


//-----------------------------POST REQUEST FOR VIEW MARKS -----------------------------
route.post('/my',function(req,res){
    marks.findOne({
        where : {
            sub_code : req.body.sub_code,
            username : req.user.username
        }
    }).then((mymarks)=>{
        res.send(mymarks);
    })
})

//-----------------------------POST REQUEST FOR CHNAGE MARKS -----------------------------
route.post('/change',function(req,res) {
    let msg = 'Failure';
    marks.findOne({
        where : {sub_code : req.body.sub_code,username : req.body.username}
    }).then((record)=>{
            if(record){
                console.log("Found! Updating ...");
                msg = 'Success';
                record.update({
                    marks_given : req.body.newmarks
                })
            }
            else{
                //No Such Record Found
                console.log("No such record found");
            }
            res.send(msg);
        });
});


//-----------------------------POST REQUEST FOR CHECK ATTEMPT -----------------------------
route.post('/checkattempt',function(req,res){
    marks.findOne({
        where : {
            sub_code : req.body.sub_code,
            username : req.user.username
        }
    }).then((val)=>{
        if(val){
            console.log("Entry Found! ALready Attempted");
            res.send("Yes");
        }
        else{
            console.log("Entry Not Found! Can Attempt");
            res.send("No");
        }
    })
});

module.exports = {
    route
}