$(()=>{
    $.get('/profile',(data)=>{
        if(data.username==undefined){
            alert("Please Login");
            document.location.href='/login';
        }
        if(data.category=="student"){
            alert("Not Authorized");
            document.location.href = '/student';
        }
        else{
            console.log("Welcome " + data.username);
            console.log(data.category);
        }
        
    });
});