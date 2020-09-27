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

$('#logout_btn').on('click',()=>{
    $.get('/logout',(data)=>{
        if(data=='Success'){
        //Logged Out Successfully
            alert("Logged Out! Please login to access the portal");
            document.location.href = '/login';
        }
    })
})