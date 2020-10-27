$(()=>{

    setTimeout(()=>{
        $('.wrapper').hide();
    },3000);

    $("#logout").hide();
    $.get('/users/profile',(data)=>{
        if(data.username){
            $('#login123')
                .text(data.username)
                .attr("href","#")
            $("#logout").show();
        }
        else{
            // alert('Please Login');
        }
    });
});

$("#logout").on('click',function(){
    $.get("/users/logout",(data)=>{
        if(data=='Success'){
            $('#logout').hide();
            $('#login123')
                .text("Login")
                .attr("href","/login")
        }
    });
});

$('#student').on('click',()=>{
    $.get('/users/profile',(data)=>{
        if(data.username){
            if(data.category!='teacher'){
                document.location.href = '/student';
            }
            else{
                alert('Not Authorized!');
            }
        }
        else{
            alert('Please login first');
            document.location.href = '/login';
        }
    });
});

$("#admin").on('click',()=>{
    $.get('/users/profile',(data)=>{
        if(data.username){
            if(data.category=='admin'){
                document.location.href = '/' + data.category;
            }
            else{
                alert('Not Authorized!');
            }
        }
        else{
            alert('Please login first');
            document.location.href = '/login';
        }
    });
});

$("#teacher").on('click',()=>{
    $.get('/users/profile',(data)=>{
        if(data.username){
            if(data.category!='student'){
                document.location.href = '/teacher';
            }
            else{
                alert('Not Authorized!');
            }
        }
        else{
            alert('Please login first');
            document.location.href = '/login';
        }
    });
});


$('#fst').on('click',()=>{
    if(window.navigator.onLine)
        alert("Online");
    else
        alert("Offline"); 
});