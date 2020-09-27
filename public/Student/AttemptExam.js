$(document).ready(()=>{
    $.get('/profile',(data)=>{
        if(data.username!=undefined){
            console.log("Welcome " + data.username);
            console.log(data.category);
        }
        else{
            alert("Please Login");
            document.location.href='/login';
        }
    });

    $('#two').hide();
});


$('#attemptexam').on('click',()=>{

    let code = $('#sub_code').val();

    let obj = {
        sub_code : code
    };

    $.post('/checkattempt',obj,(data)=>{
        console.log(data);
        if(data=="Yes"){
            alert('Already Attempted');
            document.location.href = '/student';
        }
        else{
            alert('Sending request to view questions in Exam ' + code);
            load_exam(obj);
        }
    });

});

function load_exam(obj){

    $.post('/viewexam',obj,(data)=>{

        if(data.length==0){
            alert("No Such Exam Scheduled!");
            document.location.href = '/student';
        }

        var code_inp = document.createElement("input");
        code_inp.type = 'text';
        code_inp.defaultValue = obj.sub_code;
        code_inp.name = 'sub_code';
        code_inp.setAttribute('readonly',true);
        document.getElementById('two').appendChild(code_inp);

        data.forEach((ques) => {
        
            //QUESTION
            var para = document.createElement("p");
            var q = document.createTextNode("Q" + ques["id"] + ".  " + ques["question"]);
            para.id = ques["id"];
            para.appendChild(q);
            var ele = document.getElementById("two");
            ele.appendChild(para);

            //OPTIONS
            for(var i=1;i<=4;i++){

                var k = "option";
                k+=i;

                var opt = document.createElement('input');
                opt.type = 'radio';
                opt.className = "opt";
                opt.value = String.fromCharCode( i + 64);
                opt.name = ques["id"];
                  
                var label = document.createElement('label')
                label.htmlFor = String.fromCharCode(i+64);
                  
                var description = document.createTextNode(ques[k]);
                label.appendChild(description);
                  
                var newline = document.createElement('br');
                  
                var container = document.getElementById('two');
                container.appendChild(opt);
                container.appendChild(label);
                container.appendChild(newline);
            }

        });
        
        var submitbtn = document.createElement("button");
        submitbtn.textContent = "SUBMIT";
        var newline = document.createElement('br');
        document.getElementById('two').appendChild(newline);
        document.getElementById('two').appendChild(submitbtn);

        $('#one').hide();
        $('#two').show();

    })
}