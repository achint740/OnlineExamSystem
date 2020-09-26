$(()=>{
    $.get('/profile',(data)=>{
        if(data.category!="admin"){
            alert("Not Authorized");
            document.location.href = '/';
        }
        else if(data.username!=undefined){
            console.log("Welcome " + data.username);
            console.log(data.category);
        }
        else{
            alert("Please Login");
            document.location.href='/login';
        }
    });
});