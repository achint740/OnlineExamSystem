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

    console.log('Sending request to view questions in Exam ' + code);

    let obj = {
        sub_code : code
    };

    $.post('/viewexam',obj,(data)=>{

        var code_inp = document.createElement("input");
        code_inp.type = 'text';
        code_inp.defaultValue = code;
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

})