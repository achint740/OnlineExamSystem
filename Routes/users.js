const route = require('express').Router();
const users = require('../db').usersDB;
const passport = require('../passport');


//----------------------------- INITIALIZE PASSPORT -----------------------------
route.use(passport.initialize());
route.use(passport.session());


//----------------------------- POST REQUEST FOR SIGN UP -----------------------------
route.post('/signup',(req,res)=>{
    users.create({
        username : req.body.username,
        password : req.body.password
    }).then((createdUser)=>{
        console.log('User created Successfully');
        res.redirect('/login');
    });
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