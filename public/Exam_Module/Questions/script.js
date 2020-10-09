$(()=>{
    $("#logout").hide();
    $.get('/users/profile',(data)=>{
        if(data.username==undefined){
            alert("Please Login");
            document.location.href='/login';
        }
        else if(data.category=="student"){
            alert("Not Authorized");
            document.location.href = '/';
        }
        else{
            console.log("Welcome " + data.username);
            $('#login123')
                .text(data.username)
                .attr("href","#")
            $("#logout").show();
        }
    });
});

$('#logout').on('click',()=>{
    $.get('/users/logout',(data)=>{
        if(data=='Success'){
        //Logged Out Successfully
            alert("Logged Out! Please login to access the portal");
            document.location.href = '/login';
        }
    })
});