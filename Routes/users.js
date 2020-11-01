const route = require('express').Router();
const users = require('../db').usersDB;
const passport = require('../passport');


//----------------------------- INITIALIZE PASSPORT -----------------------------
route.use(passport.initialize());
route.use(passport.session());


//----------------------------- GET REQUEST FOR VIEW USERS -----------------------------
route.get('/list',(req,res)=>{
    users.findAll({

    }).then((userslist)=>{
        res.send(userslist);
    })
});


//----------------------------- POST REQUEST FOR ADD USER -----------------------------
route.post('/add',(req,res)=>{
    users.create({
        username : req.body.username,
        password : req.body.password,
        category : req.body.category
    })
    .then((createdUser)=>{
        console.log("User Created : " + createdUser);
        res.send('Success');
    })
    .catch((err)=>{
        console.log("Error Occured : " + err);
        res.send('Failure');
    })
});


//-----------------------------POST REQUEST FOR UPDATE QUESTION -----------------------------
route.post('/update',function(req,res){

    users.findOne({
        where : {
            username : req.body.username,
        }
    }).then((user)=>{
        if(user){
            msg = 'Success';
            user.update({
                username : req.body.username,
                password : req.body.password,
                category : req.body.category
            })
            .then((updatedUser)=>{
                console.log('User Updated!');
                res.send('Update Successfull');
            })
            .catch((err)=>{
                console.log('Error Occured ' + err);
                res.send('Failed to Update! ERROR');
            })
        }
        else{
            res.send('User not found in database! Consistency error');
        }
    });
});


//----------------------------- POST REQUEST FOR DELETE USER -----------------------------
route.post('/delete',(req,res)=>{
    users.findOne({
        where  : {
            username : req.body.username
        }
    }).then((user)=>{
        if(user){
            users.destroy({
                where : {
                    username : req.body.username
                }
            }).then(()=>{
                res.send('Success! User Deleted');
            })
        }
        else{
            res.send('Failure! No Such User');
        }
    })
});


//----------------------------- POST REQUEST FOR LOGIN -----------------------------
route.post('/login',passport.authenticate('local',{failureRedirect : '/login'}),function(req,res){
    console.log("Logging In : " + req.user.username);
    return res.redirect('/' + req.user.category);
});


//----------------------------- GET REQUEST FOR PROFILE -----------------------------
route.get('/profile',function(req,res){
    res.send(req.user);
});


route.get('/logout',function(req,res){
    console.log("Logging Out " + req.user.username);
    req.logout();
    res.send('Success');
});

module.exports = {
    route
}