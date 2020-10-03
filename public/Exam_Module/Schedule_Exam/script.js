$(()=>{
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
            console.log(data.category);
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
    };

    $.post('/exam/schedule',obj,(data)=>{
        if(data=='Success'){
            alert('Subject Added to Database');
            //Append a button to be referanced to Add Question Page
        }
        else{
            alert('Failure');
        }
    });

});