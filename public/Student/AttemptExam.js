$(document).ready(()=>{
    $.get('/users/profile',(data)=>{
        if(data.username!=undefined){
            console.log("Welcome " + data.username);
            console.log(data.category);
            $('#roll').html(data.username);
            // $('.navbar').append("<button id='logout'>Logout</button>");
        }
        else{
            alert("Please Login");
            document.location.href='/login';
        }
    });

    $('#two').hide();
    $('#three').hide();
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


$('#attemptexam').on('click',()=>{

    let code = $('#sub_code1').val();

    let obj = {
        sub_code : code
    };

    $.post('/marks/checkattempt',obj,(data)=>{
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

$('#getmarks').on('click',()=>{

    $('#three').show();

    let obj = {
        sub_code : $('#sub_code2').val()
    }

    $.post('/marks/my',obj,(data)=>{
        //var marks = document.createTextNode(data.dataValues.marks_given);
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
        submitbtn.className = "submitexam";
        submitbtn.textContent = "SUBMIT";
        var newline = document.createElement('br');
        document.getElementById('two').appendChild(newline);
        document.getElementById('two').appendChild(submitbtn);

        $('#one').hide();
        $('#two').show();

        startTimer();

    })
}