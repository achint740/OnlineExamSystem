$(()=>{
    $.get('/users/profile',(data)=>{
        if(data.username==undefined){
            alert("Please Login");
            document.location.href='/login';
        }
        if(data.category=="student"){
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
            alert("Logged Out! Please login to access the portal");
            document.location.href = '/login';
        }
    })
});

function addques(){
    let obj = {
        ques : $('#ques').val(),
        op1 : $('#op1').val(),
        op2 : $('#op2').val(),
        op3 : $('#op3').val(),
        op4 : $('#op4').val(),
        sub_code : $('#sub_code').val(),
        ans : $('#ans1').val()
    }
    $.post('/ques/add',obj,(data)=>{
        document.location.href = "index.html";
        alert(data);
    });
}