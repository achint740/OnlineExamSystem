$(()=>{
    $.get('/profile',(data)=>{
        if(data.username==undefined){
            alert("Please Login");
            document.location.href='/login';
        }
        else if(data.category!="admin"){
            alert("Not Authorized");
            document.location.href = '/';
        }
        else{
            console.log("Welcome " + data.username);
            console.log(data.category);
        }
    });
});