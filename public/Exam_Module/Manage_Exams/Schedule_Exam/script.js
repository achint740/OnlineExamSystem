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

var modal = $("#myModal");

var book = $("#book");

var cross =$("#close");

cross.click(function() {
    modal.hide();
    $('body').removeClass('blur')
    $('modal').removeClass('opaque')
})

// When the user clicks anywhere outside of the modal, close it
$().click(function(event) {
    if (event.target == modal) {
    modal.hide();
    }
})

$("#logout").on('click',function(){
    $.get("/users/logout",(data)=>{
        if(data=='Success'){
            document.location.href = '/login';
        }
    });
});

$("#create_exam").on('click',()=>{
    let code = $("#sub_code").val();
    console.log("VERIFICATION!!\nYou are going to create Exam for code : " + code);

    let obj = {
        sub_code : $("#sub_code").val(),
        sub_name : $("#sub_name").val(),
        date_of_exam : $('#dateexam').val(),
        time_of_exam : $('#timeexam').val(),
        duration : +($('#duration').val())
    };

    let res = true;
    Object.keys(obj).forEach(function(key){
        if(obj[key]==""){
            res = false;
        }
    });

    if(res && duration != 0){

        $('body').addClass('blur');
        modal.addClass('opaque');
        modal.css("display", "block");
        $('#modalName').val(obj.sub_code);
        $('#modalDate').val(obj.date_of_exam);
        $('#modalTime').val(obj.time_of_exam);
        $('#modalDuration').val(obj.duration);

        $('#modalSubmit').on('click',()=>{
            modal.css("display","none");
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

        $('#cancel').on('click',()=>{
            modal.css("display","none");
        });
    }
    else{
        alert('All fields are not filled or duration is zero');
    }
});