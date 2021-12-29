var client,
  msg_array = [],
  client_connected = false,
  saved_chat = '',
  b_isClientTyping = false;
const url = `http://localhost/api/department`;

document.write(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .chatBtn {
            bottom: 0;
            position: fixed;
            margin: 1em;
            right: 0;
            z-index: 998;
            display: block;
            width: 4em;
            height: 4em;
            border-radius: 50%;
            border: none;
            text-align: center;
            color: #f0f0f0;
            z-index: 998;
            overflow: hidden;
            background: #42a5f5;
        }

        .head {
            margin: 0% 4%;
            border-bottom: 2px solid #1a1a1b;
        }

        .chatPopup {
            display: none;
            width: 25%;
            position: fixed;
            bottom: 4.2em;
            right: 4.2em;
            border: 3px solid #f1f1f1;
            z-index: 9;
            height: 65%;
        }

        #closeChat {
            display: none;
        }

        #openChat {
            display: block;
        }

        body {
            height: 100%;
            font: 16px/1.2 "Roboto", sans-serif;
            color: #333;
        }

        input[type="text"],
        button {
            border: 0;
            outline: 0;
        }

        button {
            background-color: transparent;
            cursor: pointer;
        }

        button:hover i {
            color: #79c7c5;
            transform: scale(1.2);
        }

        /* chat_box */
        .chat_box {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .chat_box>* {
            padding: 16px 0;
        }

        /* body */
        .body {
            display: none;
            flex-grow: 1;
            background-color: #eee;
            overflow-y: scroll;
            padding: 0% 3%;
        }

        .body .bubble {
            display: inline-block;
            padding: 0 3%;
            border-radius: 25px;
        }

        .body .bubble p {
            color: #f9fbff;
            font-size: 14px;
            text-align: left;
        }

        .body .incoming {
            text-align: left;
        }

        .body .incoming .bubble {
            background-color: #b2b2b2;
            overflow-wrap: break-word;
            max-width: 40%;
        }

        .body .outgoing {
            text-align: right;
        }

        .body .outgoing .bubble {
            background-color: #42a5f5;
            overflow-wrap: break-word;
            max-width: 40%;
        }

        #logout {
            display: none;
            float: right;
            font-size: larger;
        }

        /* foot */
        .foot {
            display: none;
            height: 4%;
        }

        .foot .msg {
            flex-grow: 1;
            background-color: white;
        }

        #btn_sendMessage {
            font-size: large;
            color: #1a1a1b;
            padding: 0% 3%;
        }

        #btn_Attachment {
            color: #1a1a1b;
            font-size: large;
            padding: 0 3%;
        }

        #name {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-top: 6px;
            margin-bottom: 19px;
            resize: vertical;
        }

        #mail {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-top: 6px;
            margin-bottom: 19px;
            resize: vertical;
        }

        #chatMsg {
            border: none;
        }

        .info {
            margin: 2% 4%;
        }

        input[type="Email"],
        select,
        textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-top: 6px;
            margin-bottom: 16px;
            resize: vertical;
        }

        button[type="submit"] {
            width: 60%;
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
                border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            color: #fff;
            background-color: #545b62;
            border-color: #4e555b;
        }

        button[type="submit"]:hover {
            background-color: #1a1a1b;
            color: white;
        }

        .time_date {
            color: #747474;
            display: block;
            font-size: 12px;
            margin: 3px 0 0;
            padding-bottom: 5%;
        }

        img {
            height: 80px;
            width: 80px;
            padding: auto;
            margin: auto;
        }

        .submitSection {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #wave {
          padding :50%  0%;
          width : 105%
        }
        .dot {
            display:inline-block;
            width:5px;
            height:5px;
            border-radius:50%;
            margin-right:0.1%;
            background:#303131;
            animation: wave 1.3s linear infinite;
          }
        .dot:nth-child(2) {
            animation-delay: -1.1s;
        }
        .dot:nth-child(3) {
            animation-delay: -0.9s;
        }
        @keyframes wave {
          0%, 60%, 100% {
          transform: initial;
        }
        30% {
          transform: translateY(-15px);
        }
      }

    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body onload="checkState()">
    <button class="chatBtn" onclick="openChat()" id="openChat"><i class="fa fa-comment"
            style="font-size: 1.5em;"></i></button>
    <button class="chatBtn" onclick="closeChat()" id="closeChat"><i class="fa fa-times"
            style="font-size: 1.5em;"></i></button>

    <div class="chatPopup" id="chatBox">
        <div class="chat_box">

            <div class="head">
                <i class="fa fa-user" style="font-size: 1.5em;"></i>&nbsp Live Chat
                <button style="float: right; font-size: larger; display: none;" id="logout" onclick="logout()"><i
                        class="fa fa-sign-out"></i></button>
            </div>

            <div class="info">
                <form name="login_form" onsubmit="return validateForm(event)">
                    <label for="required">Name</label>
                    <input type="text" name="Name" id="name">
                    <label for="Email">Email</label>
                    <input type="Email" name="Mail" id="mail">
                    <label for="designation">Department</label>
                    <select id="desig" name="desig">
                        <option value="" selected disabled>Select Department</option>
                        <!-- <option value="1">Sales</option>
                         <option value="2">Billing</option>
                         <option value="3">Support</option> -->
                    </select><br><br><br>
                    <div class="submitSection">
                        <button type="submit" value="submit">Start
                            Chat</button>
                    </div>

                </form>
            </div>

            <div class="body">
            </div>

            <div class="foot">
                <button id="btn_Attachment" onclick="attach()"><i class="fa fa-paperclip"></i></button>
                <input type="file" id='attached_file' accept=".jpg,.jpeg,.png" hidden onchange='getImageData(event)'>
                <input type="text" class="msg" placeholder="Type a message..." id='chatMsg' onkeypress="onValueEnter()" />
                <button id="btn_sendMessage" onclick="addmessage()"><i class="fa fa-paper-plane"></i></button>
            </div>


        </div>
    </div>

    <script>
        if (saved_chat != '') {
            console.log('Inside saved chat');
            console.log(saved_chat);
            document.getElementsByClassName('info')[0].style.display = 'none';
            document.getElementsByClassName('body')[0].style.display = 'block';
            document.getElementsByClassName('foot')[0].style.display = 'flex';
            document.getElementsByClassName('body')[0].innerHTML = '< br >' + saved_chat;
            maill = getCookie('mail');
            namee = getCookie('name');
            deptt = getCookie('dept');
            connect(namee, maill, deptt);
        }
        document.getElementsByClassName('msg')[0].addEventListener('keypress', function (e) {
            if (e.keyCode == 13) {
                addmessage();
                return false;
            }
        })
    </script>
</body>
</html>`);




class WsClient {
  constructor({ url }) {
    this.webSocket = new WebSocket(url);
    this.webSocket.onmessage = this._onMessage.bind(this);
    console.log(`Client Created`);
  }

  _onMessage(message) {
    if (this.onMessage) {
      this.onMessage(message);
    }
  }
  send(message) {
    this.webSocket.send(message);
  }
}
// Loading messages.
if (getCookie('messages')) {
  chat = JSON.parse(getCookie('messages'));
  msg_array = chat;
  if (chat) {
    for (i = 0; i < chat.length; i++) {
      if (chat[i].obj_isclient) {
        saved_chat += `<div class="outgoing">
              <div class="bubble">
              <p>${chat[i].obj_message}</p>
              </div>
              <span class="time_date">${chat[i].obj_date}
                <i class="fa fa-check" aria-hidden="true" style="float:right;"></i>
              </span></div>`
      }
      else {
        saved_chat += `<div class="incoming">
              <div class="bubble">
              <p>${chat[i].obj_message}</p>
              </div>
              <span class="time_date">${chat[i].obj_date}
                <i class="fa fa-check" aria-hidden="true"></i>
              </span></div>`
      }
    }
  }
}





/** FUNCTIONS : */

function openChat() {
  document.getElementById("chatBox").style.display = "block";
  document.getElementById("closeChat").style.display = "block";
  document.getElementById("openChat").style.display = "none";
  // localStorage.setItem('state', 'OPEN');
  setCookie('state', 'OPEN', 1);
}

function closeChat() {
  document.getElementById("closeChat").style.display = "none";
  document.getElementById("openChat").style.display = "block";
  document.getElementById("chatBox").style.display = "none";
  // localStorage.setItem('state', 'CLOSED');
  setCookie('state', 'CLOSED', 1);

}
function checkState() {
   // if ('state' in localStorage) {
  //   if (localStorage.getItem('state') == 'OPEN') {
  //     openChat();
  //   }
  // }
  // if ('name', 'mail', 'dept' in localStorage) {
  //   const { name, mail, dept } = localStorage;
  //   connect(name, mail, dept);
  // }
  const name = getCookie('name'),
    mail = getCookie('mail'),
    dept = getCookie('dept'),
    state = getCookie('state');
  if (state == 'OPEN') {
    openChat();
  }
  //------- add messages if exist ------
  if (saved_chat != '') {
    document.getElementsByClassName('info')[0].style.display = 'none';
    document.getElementsByClassName('body')[0].style.display = 'block';
    document.getElementsByClassName('foot')[0].style.display = 'flex';
    document.getElementsByClassName('body')[0].innerHTML = '<br/>' + saved_chat;
    maill = getCookie('mail');
    namee = getCookie('name');
    deptt = getCookie('dept');
  }
  if (name && mail && dept) {
    connect(name, mail, dept);
  }
  //-------- Add data inside department----------
  getAllDepartments()
    .then(deptData => {
      console.log(deptData);
      const select = document.querySelector('#desig');

      for (let i = 0; i < deptData.length; i++) {
        let opt = document.createElement('option');
        opt.value = deptData[i].sno;
        opt.innerHTML = deptData[i].name;
        select.appendChild(opt);
      }
    });
}

function validateForm(e) {
  e.preventDefault();
  let x = document.forms["login_form"]["Name"].value;
  if (x == "") {
    alert("Name must be filled out");
    return false;
  }
  let y = document.forms["login_form"]["Mail"].value;
  if (y == "") {
    alert("Email must be filled out");
    return false;
  }
  if (document.login_form.desig.selectedIndex == "0") {
    alert("Designation must be selected");
    return false;
  }
  connect(document.getElementById('name').value, document.getElementById('mail').value, document.getElementById('desig').value);
}

function connect(name, email, dept, pid = "1") {
  // client = new WsClient({ url: `wss:support.arieducation.com?name=${name}&email=${email}&dept=${dept}&pid=${pid}` });
  client = new WsClient({ url: `ws:localhost?name=${name}&email=${email}&dept=${dept}&pid=${pid}` });
  // localStorage.setItem('mail', email);
  // localStorage.setItem('name', name);
  // localStorage.setItem('dept', dept);
  setCookie('mail', email, 1);
  setCookie('name', name, 1);
  setCookie('dept', dept, 1);
  if (document.getElementsByClassName('info')[0] != undefined) {
    document.getElementsByClassName('info')[0].style.display = 'none';
    document.getElementsByClassName('body')[0].style.display = 'block';
    document.getElementsByClassName('foot')[0].style.display = 'flex';
    document.getElementById("logout").style.display = "block";
  }
  client.onMessage = function (msg) {
    var data = JSON.parse(msg.data);
    console.log(data);
    if (data.name == undefined) {
      if (data.isAgentsAvailable != undefined) {
        if (data.isAgentsAvailable) {
          document.getElementsByClassName('body')[0].innerHTML += `<h5 style="text-align : center">
            Please wait while an agent will be assigned to you.</h5>`
          client_connected = false;
          document.getElementsByClassName('msg')[0].disabled = true;
          document.getElementById('btn_sendMessage').disabled = true;
          document.getElementById('btn_Attachment').disabled = true;
        }
        else {
          document.getElementsByClassName('body')[0].innerHTML += `<h5 style="text-align : center">
                    No agents are available currently.</h5>`
          document.getElementsByClassName('msg')[0].disabled = true;
          document.getElementById('btn_sendMessage').disabled = true;
          document.getElementById('btn_Attachment').disabled = true;
        }
      }
      else if (data.isClientActive) {
        document.getElementsByClassName('body')[0].innerHTML += `<h5 style="text-align : center">
                Client with this Email is already acitve in another session.</h3>`
        client_connected = false;
        document.getElementsByClassName('msg')[0].disabled = true;
        document.getElementById('btn_sendMessage').disabled = true;
        document.getElementById('btn_Attachment').disabled = true;
      }
    }
    else {
      if (!client_connected) {
        document.getElementsByClassName('body')[0].innerHTML += `<h5 style="text-align : center">
            Hi ${name}, Agent ${data.name} is assigned to you.</h3>`
      }
      document.getElementsByClassName('msg')[0].disabled = false;
      document.getElementById('btn_sendMessage').disabled = false;
      document.getElementById('btn_Attachment').disabled = false;
      client_connected = true;
      date = new Date();
      if (data.isAgentTyping) {
        console.log("entered");
        if (!b_isClientTyping) {
          document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
                <div class="bubble">
                <div id="wave">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                </div>
                </div>`

        }
        b_isClientTyping = true;
      }
      else {
        if (data.message != '') {
          msg_obj = {
            obj_message: data.message,
            obj_isclient: false,
            obj_date: date.toLocaleTimeString()
          }
          msg_array.push(msg_obj);
          // localStorage.setItem('messages', JSON.stringify(msg_array));
          b_isClientTyping = false;
          setCookie('messages', JSON.stringify(msg_array), 1);
          // Remove typing class;
          let element = document.querySelector('#wave');
          if (element)
            element.parentNode.removeChild(element);
          // Add message to inner html
          document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
                  <div class="bubble">
                  <p>${data.message}</p>
                  </div>
                  <span class="time_date">${date.toLocaleTimeString()}
                    <i class="fa fa-check" aria-hidden="true"></i>
                  </span></div>`
        }
      }
    }
  }
}

function addmessage() {
  var message = document.getElementsByClassName("msg")[0].value;
  if (message != '') {
    client.send(message);
    date = new Date();
    msg_obj = {
      obj_message: message,
      obj_isclient: true,
      obj_date: date.toLocaleTimeString()
    };
    msg_array.push(msg_obj);
    // localStorage.setItem('messages', JSON.stringify(msg_array));
    setCookie('messages', JSON.stringify(msg_array), 1);
    document.getElementsByClassName('body')[0].innerHTML += `<div class="outgoing">
            <div class="bubble">
            <p>${message}</p>
            </div>
            <span class="time_date">${date.toLocaleTimeString()}
              <i class="fa fa-check" aria-hidden="true" style="float:right;"></i>
            </span></div>`

    document.getElementsByClassName("msg")[0].value = '';
  }
  else {
    alert('type a message');
  }
}

function attach() {
  var fileSelector = document.getElementById('attached_file');
  fileSelector.click();
}

function getImageData(event) {
  console.log(event.target.files[0]);
  let file = event.target.files[0];
  let formData = new FormData();
  blobToDataURL(file);
  formData.append('img', file);
}

function blobToDataURL(blob) {
  let reader = new FileReader();
  reader.onload = () => {
    let img = reader.result;
    date = new Date();
    msg_obj = {
      obj_message: img,
      obj_isclient: true,
      obj_date: date.toLocaleTimeString()
    };
    msg_array.push(msg_obj);
    // localStorage.setItem('messages', JSON.stringify(msg_array));
    setCookie('messages', JSON.stringify(msg_array), 1);
    document.getElementsByClassName('body')[0].innerHTML +=
      `<div class="outgoing">
        <div class="bubble">
        <img src=${img}>
        </div>
        <span class="time_date">${date.toLocaleTimeString()}
          <i class="fa fa-check" aria-hidden="true" style="float:right;"></i>
        </span></div>`
  }
  reader.readAsDataURL(blob);
}

function getAllDepartments() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(result => resolve(result.departments))
  })
}

function logout() {
  if (confirm('Your chat history will be cleared, you wish to proceed to logout?')) {
    localStorage.clear();
    deleteCookie('dept');
    deleteCookie('name');
    deleteCookie('state');
    deleteCookie('messages');
    deleteCookie('mail');

    window.location.reload();
  }
}

function onValueEnter() {
  client.send("isClientTyping");
}
//========== Curd cookies=====================//
function setCookie(name, value, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/" + ";sameSite=Lax;";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function deleteCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
