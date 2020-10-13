$(()=>{
    $("#logout").hide();
    $.get('/users/profile',(data)=>{
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
            $('#login123')
                .text(data.username)
                .attr("href","#")
            $("#logout").show();
        }
        $("#sub_code").val('');
        $("#sub_name").val('');
        $('#dateexam').val('');
        $('#timeexam').val('');
    });
});

$("#logout").on('click',function(){
    $.get("/users/logout",(data)=>{
        if(data=='Success'){
            document.location.href = '/login';
        }
    });
});

$("#create_exam").on('click',()=>{
    let code = $("#sub_code").val();
    alert("VERIFICATION!!\nYou are going to create Exam for code : " + code);

    let obj = {
        sub_code : $("#sub_code").val(),
        sub_name : $("#sub_name").val(),
        date_of_exam : $('#dateexam').val(),
        time_of_exam : $('#timeexam').val(),
        duration : $('#duration').val()
    };

    $.post('/exam/schedule',obj,(data)=>{
        if(data=='Success'){
            alert('Subject Added to Database');
            document.location.href = "../../Questions/index.html";
        }
        else{
            alert('Subject with this code already exists!');
        }
    });

});