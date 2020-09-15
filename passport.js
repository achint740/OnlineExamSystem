const passport = require('passport');
const strategy = require('passport-local').Strategy;
const Users = require('./Users_db').Users;

passport.use(new strategy(
    function(username,password,done){
        Users.findOne({
            where : {
                username : username
            }
        }).then((user)=>{
            if(!user){
                console.log('You havent signed up buddy!!');
                return done(null,false,{message : 'Incorrect UserName'});
            }
            if(user.password != password){
                console.log('MisMatch!\nTry Again!!');
                return done(null,false,{message : 'Incorrect Password'});
            }
            return done(null,user);
        }).catch(done)
    }
));

passport.serializeUser(function(user,done){
    done(null,user.username);
});

passport.deserializeUser(function(username,done){
    Users.findOne({
         where : { username : username }
    }).then((user)=>{
        if(!user){
            return done(new Error('No Such User'));
        }
       return done(null,user);
    }).catch((err)=>{
        done(err);
    });
});

module.exports = passport;