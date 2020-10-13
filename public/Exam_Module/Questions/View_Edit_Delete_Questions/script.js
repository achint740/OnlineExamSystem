$(()=>{
    $.get('/users/profile',(data)=>{
        if(data.username==undefined){
            alert("Please Login");
            document.location.href='/login';
        }
        if(data.category=="student"){
            alert("Not Authorized");
            document.location.href = '/student';
        }
        else{
            console.log("Welcome " + data.username);
            console.log(data.category);
        }
        
    });
    $('#one').show();
    $('#two').hide();
});

$('#logout').on('click',()=>{
    $.get('/users/logout',(data)=>{
        if(data=='Success'){
        //Logged Out Successfully
            alert("Logged Out! Please login to access the portal");
            document.location.href = '/login';
        }
    })
});

$('#viewexam').on('click',()=>{
    let code = $('#sub_code').val();
    console.log('Sending request to view questions in Exam ' + code);

    let obj = {
        sub_code : code
    };

    $.post('/exam/view',obj,(data)=>{
        // console.log(data);
        if(data.length == 0){
            alert('No Questions for : ' + obj.sub_code);
        }
        else{
            $('#two').empty();
            create_header();
            view_ques(data);
        }

    });

    $('#two').show();

});

function create_header(){

    var tablehead = document.createElement("thead");

    var header_row = document.createElement("tr");
    
    var th,th_data;

    th = document.createElement("th");
    th_data = document.createTextNode("Question ID");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Question");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Option 1");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Option 2");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Option 3");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Option 4");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Answer");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Update");
    th.appendChild(th_data);
    header_row.appendChild(th);

    th = document.createElement("th");
    th_data = document.createTextNode("Delete");
    th.appendChild(th_data);
    header_row.appendChild(th);

    tablehead.appendChild(header_row);
    document.getElementById("two").appendChild(tablehead);
}

function update_ques(obj){
    $.post('/ques/update',obj,(data)=>{
        if(data=='Success')
            alert("Q" + obj.id + " Updated Successfully");
        else 
            alert('Error! Try Again Please');
    });
}

function delete_ques(obj){
    $.post('/ques/delete',obj,(data)=>{
        if(data=='Success'){
            $('#viewexam').click();
            alert("Q" + obj.id + " Deleted Successfully");
        }
        else 
            alert('Error! Try Again Please');
    });
}

function view_ques(questions_list){
    var tablebody = document.createElement("tbody");
    questions_list.forEach((question)=>{

        
        var new_row = document.createElement("tr");

        //QUESTION ID   
        var qid = document.createElement("td");
        var qid_text = document.createTextNode("Q" + question["id"]);
        qid.appendChild(qid_text);
        qid.id = question["id"];
        new_row.appendChild(qid);

        //QUESTION DESCRIPTION
        var ques = document.createElement("td");
        var ques_text = document.createTextNode(question["question"]);
        ques.appendChild(ques_text);
        ques.contentEditable = "true";
        new_row.appendChild(ques);


        //OPTIONS
        for(var i=1;i<=4;i++){
            var op = document.createElement("td");
            var k = "option";
            k+=i;
            op.contentEditable = "true";
            var op_text = document.createTextNode(question[k]);
            op.appendChild(op_text);
            op.className = k;
            new_row.appendChild(op);
        }

        //CORRECT ANSWER
        var ans = document.createElement("td");
        var ans_text = document.createTextNode(question["answer"]);
        ans.appendChild(ans_text);
        ans.contentEditable = "true";
        new_row.appendChild(ans);

        //UPDATE
        var btn_td1 = document.createElement("td");
        var upd_btn = document.createElement("button");
        upd_btn.textContent = "Update";
        upd_btn.className = "btn btn-warning";
        btn_td1.appendChild(upd_btn);
        new_row.appendChild(btn_td1);

        upd_btn.addEventListener("click",function(){
            let obj = {
                sub_code : $("#sub_code").val(),
                id : this.parentElement.parentElement.firstChild.id,
                answer : this.parentElement.previousSibling.innerHTML,
                option4 : this.parentElement.previousSibling.previousSibling.innerHTML,
                option3 : this.parentElement.previousSibling.previousSibling.previousSibling.innerHTML,
                option2 : this.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML,
                option1 : this.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML,
                question : this.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML
            };
            update_ques(obj);
        })

        //DELETE
        var btn_td2 = document.createElement("td");
        var del_btn = document.createElement("button");
        del_btn.textContent = "Delete";
        del_btn.className = "btn btn-danger";
        btn_td2.appendChild(del_btn);
        new_row.appendChild(btn_td2);

        del_btn.addEventListener("click",function(){
            let obj = {
                sub_code : $('#sub_code').val(),
                id : this.parentElement.parentElement.firstChild.id
            };
            delete_ques(obj);
        });


        tablebody.appendChild(new_row);
    });
    document.getElementById("two").appendChild(tablebody);
}