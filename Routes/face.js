const route = require('express').Router();
const fs = require('fs');
const passport = require('../passport');


//----------------------------- INITIALIZE PASSPORT -----------------------------
route.use(passport.initialize());
route.use(passport.session());


route.post('/verify',function(req,res){
    if(!req.user){
        return res.redirect('/login');
    }
   
    var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
    var saveTo = "C:\\Users\\sargam\\Desktop\\OnlineExamSystem\\public\\xyz\\";
    var split_name = (req.user.username).split('/');
    var join_name = split_name.join('-');
    var image_name =  join_name + '.png';
    saveTo+=image_name;
    fs.writeFile(saveTo, base64Data, 'base64', function(err) {
        if(err){
            console.log(err);
        }  
        else{
            console.log('Sending Request to Connect to Face Recognition ML Code');
            var spawn = require("child_process").spawn; 
            var process = spawn('python',['./Face_Recognition/FaceRecognition.py', saveTo]) 
            console.log('Connection Successfull');
            process.stdout.on('data',function(response){
                // console.log(response.toString());
                res.send(response.toString());
            });
        }    
    });
    
    
});

module.exports = {
    route
}