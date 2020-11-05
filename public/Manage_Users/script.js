$(()=>{

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
            viewusers();
        }
    });

$('#logout').on('click',()=>{
    $.get('/users/logout',(data)=>{
        if(data=='Success'){
            alert("Logged Out! Please login to access the portal");
            document.location.href = '/login';
        }
    });
});

let total_users = 0;

function adduser(){
    var new_row = document.createElement("tr");
            
    //Serial Number
    var sno = document.createElement('th');
    var sno_text = document.createTextNode(total_users);
    sno.appendChild(sno_text);
    new_row.appendChild(sno);

    //UserName 
    var username = document.createElement("td");
    var user_text = document.createTextNode("Enter UserName");
    username.appendChild(user_text);
    username.contentEditable = "true";
    new_row.appendChild(username);

    //Password 
    var password = document.createElement("td");
    var pass_text = document.createTextNode("Enter Password");
    password.appendChild(pass_text);
    password.contentEditable = "true";
    new_row.appendChild(password);

    //Category 
    var category = document.createElement("td");
    var category_text = document.createTextNode("Enter Category");
    category.appendChild(category_text);
    category.contentEditable = "true";
    new_row.appendChild(category);

    //UPDATE
    var btn_td1 = document.createElement("td");
    var add_btn = document.createElement("button");
    add_btn.textContent = "Add";
    add_btn.className = "btn btn-success";
    btn_td1.appendChild(add_btn);
    new_row.appendChild(btn_td1);

    add_btn.addEventListener("click",function(){

        if(this.textContent == "Update"){
            upd(this);
        }
        else{
            let new_user = {
                username : this.parentElement.previousSibling.previousSibling.previousSibling.innerHTML,
                password : this.parentElement.previousSibling.previousSibling.innerHTML,
                category : this.parentElement.previousSibling.innerHTML
            }
            $.post('/users/add',new_user,(data)=>{
                if(data=='Success'){
                    alert('User Added Successfully');
                    this.textContent = "Update";
                    this.className = "btn btn-warning"
                    total_users+=1;
                    this.parentElement.nextSibling.children[0].textContent = "Delete";
                }
                
            });
        }
    });

    //DELETE
    var btn_td2 = document.createElement("td");
    var del_btn = document.createElement("button");
    del_btn.textContent = "Remove";
    del_btn.className = "btn btn-danger";
    btn_td2.appendChild(del_btn);
    del_btn.addEventListener("click",function(){
        if(this.textContent == "Delete"){
            del(this);
        }
        else{
            this.parentElement.parentElement.remove();
        }
    })
    new_row.appendChild(btn_td2);

    $(new_row).prependTo("table > tbody");
}

function upd(btn){
    let user = {
        username : btn.parentElement.previousSibling.previousSibling.previousSibling.innerHTML,
        password : btn.parentElement.previousSibling.previousSibling.innerHTML,
        category : btn.parentElement.previousSibling.innerHTML
    };
    $.post('/users/update',user,(data)=>{
        alert(data);
    });
}

function del(btn){
    $('body').addClass('blur')

    modal.addClass('opaque')

    modal.css("display", "block")
    let user = {
        username : btn.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML
    };
    $('#modalName').val(user.username);
    $('#modalSubmit').on('click',()=>{
        modal.css("display","none");
        $.post('/users/delete',user,(data)=>{
            alert(data);
            btn.parentElement.parentElement.remove();
        });
    });
    $('#cancel').on('click',()=>{
        modal.css("display","none");
    })
}

function viewusers(){
    var i  = 1;
    $.get('/users/list',(userlist)=>{
        var tablebody = document.createElement("tbody");
        $('.wrapper').hide();
        userlist.forEach((user)=>{
            var new_row = document.createElement("tr");
            
            //Serial Number
            var sno = document.createElement('th');
            var sno_text = document.createTextNode(i);
            sno.appendChild(sno_text);
            new_row.appendChild(sno);

            //UserName 
            var username = document.createElement("td");
            var user_text = document.createTextNode(user["username"]);
            username.appendChild(user_text);
            new_row.appendChild(username);

            //Password 
            var password = document.createElement("td");
            var pass_div = document.createElement("div");
            var pass_span = document.createElement("span");
            var pass_i = document.createElement("i");
            pass_i.className = "fa fa-eye-slash";
            pass_span.appendChild(pass_i);
            var pass_p = document.createElement("p");
            var pass_text = document.createTextNode(user["password"]);
            pass_p.appendChild(pass_text);
            // pass_p.hidden = "true";
            pass_div.appendChild(pass_p);
            pass_div.appendChild(pass_span);
            password.appendChild(pass_div);
            pass_p.contentEditable = "true";
            pass_span.addEventListener("click", function(){
                // alert('clicked');
                // pass_p.hidden = "false";
                this.hidden = "true";
                // this.previousSibling.hidden = "false";
            });
            new_row.appendChild(password);

            //Category 
            var category = document.createElement("td");
            var category_text = document.createTextNode(user["category"]);
            category.appendChild(category_text);
            category.contentEditable = "true";
            new_row.appendChild(category);

            //UPDATE
            var btn_td1 = document.createElement("td");
            var upd_btn = document.createElement("button");
            upd_btn.textContent = "Update";
            upd_btn.className = "btn btn-warning";
            btn_td1.appendChild(upd_btn);
            upd_btn.addEventListener("click",function(){
                upd(this);
            });
            new_row.appendChild(btn_td1);

            //DELETE
            var btn_td2 = document.createElement("td");
            var del_btn = document.createElement("button");
            del_btn.textContent = "Delete";
            del_btn.className = "btn btn-danger";
            btn_td2.appendChild(del_btn);
            del_btn.addEventListener("click",function(){
                del(this);
            })
            new_row.appendChild(btn_td2);


            tablebody.appendChild(new_row);
            i++;
            total_users = i;
        });

        document.getElementById('users_table').appendChild(tablebody);
    });
}


function filter_users() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("filter");
    filter = input.value.toUpperCase();
    table = document.getElementById("users_table");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}

});