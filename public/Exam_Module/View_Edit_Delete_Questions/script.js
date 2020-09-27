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
        $('#two').empty();
        data.forEach((ques) => {
            
            //QUESTION
            var para = document.createElement("p");
            var q = document.createTextNode(ques["question"]);
            para.appendChild(q);
            para.contentEditable = "true";
            para.id = ques["id"];
            var ele = document.getElementById("two");
            ele.appendChild(para);

            //Options
            for(var i=1;i<=4;i++){
                var p = document.createElement("p");
                var k = "option";
                k+=i;
                p.contentEditable = "true";
                var op = document.createTextNode(ques[k]);
                p.appendChild(op);
                p.className = k;
                var e = document.getElementById("two");
                e.appendChild(p);
            }

            var upd_btn = document.createElement("button");
            upd_btn.textContent = "Update";
            document.getElementById("two").appendChild(upd_btn);

            upd_btn.addEventListener("click",function(){
                let obj = {
                    sub_code : $('#sub_code').val(),
                    id : this.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.id,
                    question : this.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML,
                    option1 : this.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML,
                    option2 : this.previousSibling.previousSibling.previousSibling.innerHTML,
                    option3 : this.previousSibling.previousSibling.innerHTML,
                    option4 : this.previousSibling.innerHTML 
                }
                update_ques(obj);
            });

            var del_btn = document.createElement("button");
            del_btn.textContent = "Delete";
            document.getElementById("two").appendChild(del_btn);

            del_btn.addEventListener("click",function(){
                let obj = {
                    sub_code : $('#sub_code').val(),
                    id : this.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.id
                }
                delete_ques(obj);
            });
            
        });
    });

    // $('#one').hide();
    $('#two').show();

});

function update_ques(obj){
    $.post('/updateques',obj,(data)=>{
        if(data=='Success')
            alert("Question " + obj.id + " Updated Successfully");
        else 
            alert('Error! Try Again Please');
    });
}

function delete_ques(obj){
    $.post('/deleteques',obj,(data)=>{
        if(data=='Success'){
            $('#viewexam').click();
            alert("Question " + obj.id + " Deleted Successfully");
        }
        else 
            alert('Error! Try Again Please');
    });
}