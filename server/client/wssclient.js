var client, msg_image = false, msg_array = [], client_connected = false, saved_chat = '';

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

if (localStorage.getItem('messages') != null) {
    chat = JSON.parse(localStorage.getItem('messages'));
    msg_array = chat;
    if (chat != null) {
        for (i = 0; i < chat.length; i++) {
            if (chat[i].obj_isclient) {
                saved_chat += `<div class="outgoing">
            <div class="bubble">
            <p>${chat[i].obj_message}</p>
            </div>
            <span class="time_date">${chat[i].obj_date}</span></div>`
            }
            else {
                saved_chat += `<div class="incoming">
            <div class="bubble">
            <p>${chat[i].obj_message}</p>
            </div>
            <span class="time_date">${chat[i].obj_date}</span></div>`
            }
        }
    }
}

function openChat() {
    document.getElementById("chatBox").style.display = "block";
    document.getElementById("closeChat").style.display = "block";
    document.getElementById("openChat").style.display = "none";
}

function closeChat() {
    document.getElementById("closeChat").style.display = "none";
    document.getElementById("openChat").style.display = "block";
    document.getElementById("chatBox").style.display = "none";
}

function validateForm(e) {
    e.preventDefault();
    document.getElementById("logout").style.display = "block";
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

    client = new WsClient({ url: `ws:localhost?name=${name}&email=${email}&dept=${dept}&pid=${pid}` });

    localStorage.setItem('mail', email);
    localStorage.setItem('name', name);
    localStorage.setItem('dept', dept);

    if (document.getElementsByClassName('info')[0] != undefined) {
        document.getElementsByClassName('info')[0].style.display = 'none';
        document.getElementsByClassName('body')[0].style.display = 'block';
        document.getElementsByClassName('foot')[0].style.display = 'flex';
    }

    client.onMessage = function (msg) {
        var data = JSON.parse(msg.data);
        if (data.name == undefined) {

            document.getElementsByClassName('body')[0].innerHTML += `<h5 style="text-align : center">
            Please wait while an agent will be assigned to you.</h3>`

            client_connected = false;
            document.getElementsByClassName('msg')[0].disabled = true;
            document.getElementById('btn_sendMessage').disabled = true;
            document.getElementById('btn_Attachment').disabled = true;
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
            if (data.message != '') {
                msg_obj = {
                    obj_message: data.message,
                    obj_isclient: false,
                    obj_date: date.toLocaleTimeString()
                }
                msg_array.push(msg_obj);
                localStorage.setItem('messages', JSON.stringify(msg_array));
                document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
                <div class="bubble">
                <p>${data.message}</p>
                </div>
                <span class="time_date">${date.toLocaleTimeString()}</span>`
            }
        }
    }
}

function addmessage() {
    if (msg_image) {
        var file = document.getElementById('filename').files[0];
        var reader = new FileReader();
        var rawData = new ArrayBuffer();
        reader.onload = function (e) {
            rawData = e.target.result;
            client.send(rawData);
            alert("the File has been transferred.")
        }
        reader.readAsArrayBuffer(file);
        date = new Date();
        var message = document.getElementsByClassName("msg")[0].value;
        document.getElementsByClassName('body')[0].innerHTML += `<div class="outgoing">
        <div class="bubble">
        <a>${message}</a>
        </div>
        <span class="time_date">${date.toLocaleTimeString()}</span></div>`
        document.getElementsByClassName("msg")[0].value = '';
    }
    else {
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
            localStorage.setItem('messages', JSON.stringify(msg_array));
            document.getElementsByClassName('body')[0].innerHTML += `<div class="outgoing">
            <div class="bubble">
            <p>${message}</p>
            </div>
            <span class="time_date">${date.toLocaleTimeString()}</span></div>`
            document.getElementsByClassName("msg")[0].value = '';
        }
        else {
            alert('type a message');
        }
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
        let imgTag = document.createElement('img');
        imgTag.src = img;
        document.getElementsByClassName('body')[0].appendChild(imgTag);
        // var msgDiv = document.createElement('div');
        // msgDiv.setAttribute('class','outgoing');
        // msgDiv.cr
        // document.getElementsByClassName('body')[0].innerHTML += `<div class="outgoing">
        // <div class="bubble">
        // ${document.appendChild(imgTag)}
        // </div>
        // <span class="time_date">${date.toLocaleTimeString()}</span>`
    }
    reader.readAsDataURL(blob);
}


function logout(){
    if(confirm('Your chat history will be cleared, you wish to proceed to logout?'))
    {
        localStorage.clear();
        window.location.reload();
    }
}