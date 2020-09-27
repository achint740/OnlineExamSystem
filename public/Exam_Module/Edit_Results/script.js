$(()=>{
    $.get('/profile',(data)=>{
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
    $('#markstable').hide();
});

$('#showtable').on('click',refresh);

function refresh(){
    let obj = {
        sub_code : $('#sub_code').val()
    }    

    let sr_no = 1;

    $.post('/markslist',obj,(data)=>{

        if(data.length>0){
            $('#markstable').empty().show();
            $('#markstable').append('<tr><th>Sr. No.  </th><th>Roll No. </th><th>Marks Given</th><th>New Marks</th><th>Action</th></tr>');
        }

        else{
            $('#markstable').empty();
            alert("No Record Found for this Subject!");
        }

        data.forEach((record) => {
            
            var row = document.createElement("tr");
            
            var sno = document.createElement("td");
            var sno_text = document.createTextNode(sr_no);
            sno.appendChild(sno_text);
            row.appendChild(sno);

            var rollnum = document.createElement("td");
            var rollnum_text = document.createTextNode(record["username"]);
            rollnum.className = 'roll';
            rollnum.appendChild(rollnum_text);
            row.appendChild(rollnum);

            var marksgiven = document.createElement("td");
            var marksgiven_text = document.createTextNode(record["marks_given"]);
            marksgiven.appendChild(marksgiven_text);
            row.appendChild(marksgiven);

            var marksnew = document.createElement("td");
            var marksnew_inp = document.createElement("input");
            marksnew_inp.type = "text";
            marksnew_inp.className = "newmarks";
            marksnew.appendChild(marksnew_inp);
            row.appendChild(marksnew);

            var action = document.createElement("td");
            var action_btn = document.createElement("button");
            action_btn.textContent = "CHANGE";
            action_btn.className = "change";
            action_btn.addEventListener("click",function(){
                // alert('Clicked');
                let roll = this.parentElement.parentElement.children[1].innerHTML;
                let new_marks = this.parentElement.parentElement.children[3].children[0].value;
                console.log(roll + " " + new_marks);
                changemarks(roll,new_marks);
            });
            action.appendChild(action_btn);
            row.appendChild(action);

            document.getElementById("markstable").appendChild(row);
            
            sr_no++;
        });

    });

}

function changemarks(roll,new_marks) {

   let obj = {
       username : roll,
       sub_code : $('#sub_code').val(),
       newmarks : new_marks 
   };

   console.log(obj);

   $.post('/changemarks',obj,(data)=>{
       if(data=='Success'){
            alert("Marks for : " + roll + " changed to : " + new_marks);
            refresh();
       }
       else{
           alert('Failure! Not able to update');
       }
   });

}