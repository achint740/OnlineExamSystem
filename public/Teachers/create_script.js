$('#create_exam').on('click',()=>{
    //Send a request to backend to create a database 
    //for this subject

})

$('#create_new').on('click',()=>{

    console.log('New Question Button Clicked');

    
    $('#ques_list').append("<br><input type='text' value='Enter Ques Number'>")
    $('#ques_list').append("    <input type='text' class='ques' value='Enter Ques here'>");
    $("#ques_list").append("    <button id='add_ques' onclick=adder()>ADD/UPDATE</button>");
    $("#ques_list").append("    <button id='del_ques' onclick=deleter()>DELETE</button><br><br>")
        
});   


function adder(){
    console.log("Add/Update Question Button clicked");
    $('#ques_list').remove();
}

function deleter(){
    console.log("Delete Question Button clicked");

}