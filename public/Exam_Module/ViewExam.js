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
            
            //QUESTION
            var para = document.createElement("p");
            var q = document.createTextNode(ques["id"] + "  " + ques["question"]);
            para.appendChild(q);
            var ele = document.getElementById("two");
            ele.appendChild(para);

            //Options
            for(var i=1;i<=4;i++){
                var p = document.createElement("p");
                var k = "option";
                k+=i;
                var op = document.createTextNode(k + "  " + ques[k]);
                p.appendChild(op);
                var e = document.getElementById("two");
                e.appendChild(p);
            }
            
        });
    });

    $('#one').hide();
    $('#two').show();

})