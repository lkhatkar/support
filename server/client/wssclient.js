var client, msg_image = false, msg_array = [];

// if (localStorage.getItem('mail') != '') {
//     maill = localStorage.getItem('mail');
//     namee = localStorage.getItem('name');
//     deptt = localStorage.getItem('dept');
//     connect(nme, maill, deptt);
//     chat = localStorage.getItem('messages');
//     msg_array = chat;
//     for (i = 0; i < chat.length; i++) {
//         if (chat[i].obj_isclient) {
//             document.getElementsByClassName('body')[0].innerHTML += `<div class="outgoing">
//             <div class="bubble">
//             <p>${chat[i].obj_message}</p>
//             </div>
//             <span class="time_date">${chat[i].obj_date.toLocaleString('en-GB')}</span>`
//         }
//         else {
//             document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
//             <div class="bubble">
//             <p>${chat[i].obj_message}</p>
//             </div>
//             <span class="time_date">${chat[i].obj_date.toLocaleString('en-GB')}</span>`
//         }
//     }
// }

function connect(name, email, dept, pid = "1") {

    client = new WsClient({ url: `ws:localhost?name=${name}&email=${email}&dept=${dept}&pid=${pid}` });

    localStorage.setItem('mail', email);
    localStorage.setItem('name', name);
    localStorage.setItem('dept', dept);

    document.getElementsByClassName('info')[0].style.display = 'none';
    document.getElementsByClassName('body')[0].style.display = 'block';
    document.getElementsByClassName('foot')[0].style.display = 'flex';


    client.onMessage = function (msg) {
        var data = JSON.parse(msg.data);
        date = new Date();
        if (data.message != '') {
            var msg_obj = {
                obj_message: data.message,
                obj_isclient: false,
                obj_date: date
            }
            msg_array.push(msg_obj);
            localStorage.setItem('messages', msg_array);
            document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
            <div class="bubble">
            <p>${data.message}</p>
            </div>
            <span class="time_date">${date.toLocaleString('en-GB')}</span>`
        }
        if (data.name == undefined) {
            document.getElementsByClassName('msg')[0].disabled = true;
            document.getElementById('btn_sendMessage').disabled = true;
            document.getElementById('btn_Attachment').disabled = true;
        }
        else {
            document.getElementsByClassName('msg')[0].disabled = false;
            document.getElementById('btn_sendMessage').disabled = false;
            document.getElementById('btn_Attachment').disabled = false;
        }
    }
}

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
        <span class="time_date">${date.toLocaleString('en-GB')}</span>`
        document.getElementsByClassName("msg")[0].value = '';
    }
    else {
        var message = document.getElementsByClassName("msg")[0].value;
        if (message != '') {
            client.send(message);
            date = new Date();
            var msg_obj = {
                obj_message: message,
                obj_isclient: true,
                obj_date: date
            };
            msg_array.push(msg_obj);
            localStorage.setItem('messages', msg_array);
            document.getElementsByClassName('body')[0].innerHTML += `<div class="outgoing">
            <div class="bubble">
            <p>${message}</p>
            </div>
            <span class="time_date">${date.toLocaleString('en-GB')}</span>`
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

function getImageData(event)
{
    console.log(event.target.files[0]);//sennd to server
    let file=event.target.files[0];
    let formData=new FormData();
    blobToDataURL(file);
    formData.append('img',file);
    console.log(formData);
}

function blobToDataURL(blob){
    let reader=new FileReader();
    reader.onload=()=>{
        let img=reader.result;
        let imgTag=document.createElement('img');
        imgTag.src=img;
        // imgTag.height=20+'px';
        // imgTag.width=50+'px';
        console.log('imgTag',imgTag);
        document.getElementsByClassName('body')[0].appendChild(imgTag); 
        // document.getElementsByClassName("msg")[0].value = '';
    }
    reader.readAsDataURL(blob);
}




