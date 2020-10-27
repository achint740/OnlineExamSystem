function add(){
    let obj = {
        username : $('#userid0').val(),
        password : $('#temp_pass').val(),
        category : $('#category').val()
    };

    $.post('/users/add',obj,(data)=>{
        alert('User Add : ' + data);
        if(data=='Success'){
            $('#userid0').val('');
            $('#temp_pass').val('');
            $('#category').val('Category');
        }
    });

}

function deleteuser(){
    let obj = {
        username : $('#userid2').val()
    };
    $.post('/users/delete',obj,(data)=>{
        alert(data);
        if(data=='Success'){
            $('#userid2').val('');
        }
    });
}

function edituser(){
    console.log('User Edit');
}
