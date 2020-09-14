$(()=>{
    $('#one').show();
    $('#two').hide();
})

$('#viewexam').on('click',()=>{
    let code = $('#sub_code').val();
    console.log('Sending request to view questions in Exam ' + code);

    let obj = {
        sub_code : code
    };

    $.post('/viewexam',obj,(data)=>{
        // console.log(data);
        data.forEach((ques) => {
            for(var key of Object.keys(ques)){
                console.log(key + "  " + ques[key]);
            }
        });
    });

})