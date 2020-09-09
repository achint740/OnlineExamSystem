const exp = require("express");
const app = exp();
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

app.listen(1001,()=>{
    console.log('Server started');
});