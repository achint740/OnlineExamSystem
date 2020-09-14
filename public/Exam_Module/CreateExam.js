$("#create_exam").on('click',()=>{
    let code = $("#sub_code").val();
    alert("VERIFICATION!!\nYou are going to create Exam for code : " + code);

    let obj = {
        sub_code : $("#sub_code").val(),
        sub_name : $("#sub_name").val()
    };

    $.post('/addsubject',obj,(data)=>{
        if(data=='Success'){
            alert('Subject Added to Database');
        }
        else{
            alert('Failure');
        }
    });

});