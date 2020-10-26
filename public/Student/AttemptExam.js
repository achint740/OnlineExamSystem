$(document).ready(()=>{
    $.get('/users/profile',(data)=>{

        setTimeout(()=>{
          $('.wrapper').hide();
        },3000);

        if(data.username!=undefined){
            console.log("Welcome " + data.username);
            $('#roll').html(data.username);
        }
        else{
            alert("Please Login");
            document.location.href='/login';
        }
    });

    $('#two').hide();
    $('#three').hide();
});

$("#logout").on('click',function(){
  $.get("/users/logout",(data)=>{
      if(data=='Success'){
        alert('Logged out!');
          document.location.href = '/';
      }
  });
});

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

// document.getElementById("btn").addEventListener("click",function(){
//     startTimer();
// })

function onTimesUp() {
  clearInterval(timerInterval);
  $('.submitexam').click();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function get_curr_date(){
  return new Promise((resolve,reject)=>{
    var today = new Date();
    console.log(typeof(today));
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd;
    } 
    if(mm<10){
      mm='0'+mm;
    } 
    today = yyyy +'-'+ mm +'-'+ dd;
    console.log(today);
    resolve(today);
  })
}

function time_diff(set_date){
    let today = new Date();
    let curr_hh = today.getHours();
    let curr_min = today.getMinutes();
    
    let scheduled_time = set_date.time.split(':');

    let diff = (curr_hh-scheduled_time[0])*60 + curr_min-scheduled_time[1];
    console.log("Diff ayaa : " + diff);

    return ((diff>=0) && (diff<=15));

}

function compare_date(set_date){

  return new Promise((resolve,reject)=>{
    if(set_date.status=="Failure"){
      resolve(-1);
    }
    get_curr_date().then((today)=>{
      let curr_date_1 = today.split('-');
      let set_date_1 = (set_date.date).split('-');
    
      console.log(curr_date_1);
      console.log(set_date_1);
    
      if(curr_date_1[0]==set_date_1[0]){
        if(curr_date_1[1]==set_date_1[1]){
           if(curr_date_1[2]==set_date_1[2]){
              let res = time_diff(set_date);
              resolve(res);
          }
        }
      }
      
      resolve(0);
    })
  })
}


$('#attemptexam').on('click',()=>{

    let code = $('#sub_code1').val();

    let obj = {
        sub_code : code
    };

    $.post('/exam/get_time',obj,(data)=>{
      
        compare_date(data).then((result)=>{
          console.log("Compare karke result aaya : " + result);
          if(result == -1){
              alert("No such exam scheduled");
          }
          else if(result==0){
              alert('Not allowed to give exam now! Exam Scheduled at ' + data.date + ' at ' + data.time);
          }
          else{
              $.post('/marks/checkattempt',obj,(data)=>{
                  console.log(data);
                  if(data=="Yes"){
                      alert('Already Attempted');
                      document.location.href = '/student';
                  }
                  else if(data=="Error"){
                    alert('Error Occured!');
                  }
                  else{
                      alert('Sending request to view questions in Exam ' + code);
                      document.documentElement.requestFullscreen();
                      load_exam(obj);
                  }
              });
          }
      });
    });
});

$('#getmarks').on('click',()=>{

    $('#three').show();

    let obj = {
        sub_code : $('#sub_code2').val()
    }

    $.post('/marks/my',obj,(data)=>{
        var m = document.createTextNode(data.marks_given);
        console.log(data);
        document.getElementById('myscore').appendChild(m);
    });
})

function load_exam(obj){

    $.post('/exam/view',obj,(data)=>{

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

            var ques_div = document.createElement("div");
            ques_div.id = "ques_div";
        
            //QUESTION
            var para = document.createElement("p");
            var q = document.createTextNode("Q" + ques["id"] + ".  " + ques["question"]);
            para.id = ques["id"];
            para.appendChild(q);
            ques_div.appendChild(para);

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
                  
                ques_div.appendChild(opt);
                ques_div.appendChild(label);
                ques_div.appendChild(newline);
            }

            var hr = document.createElement('hr');
            ques_div.appendChild(hr);

          document.getElementById('two').appendChild(ques_div);

        });
        
        var submitbtn = document.createElement("button");
        submitbtn.className = "submitexam";
        submitbtn.textContent = "SUBMIT";
        submitbtn.id = "mybtn";
        var newline = document.createElement('br');
        document.getElementById('two').appendChild(newline);
        document.getElementById('two').appendChild(submitbtn);

        $('#one').hide();
        $('#two').show();

        startTimer();

    })
}

function exitHandler(){
  if(!document.fullscreenElement){
      console.log("Exit Screen");
      $('#mybtn').click();
  }
}

document.addEventListener('fullscreenchange',exitHandler,false);