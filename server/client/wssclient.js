var client, incoming_messages, outgoing_messages;

// if (localStorage.getItem('mail').value != null) {
//     connect(localStorage.getItem('name'), localStorage.getItem('mail'), localStorage.getItem('desig'));
// }


function connect(name, email, dept, pid = "1") {
    // localStorage.setItem('mail', email);
    // localStorage.setItem('name', name);
    switchVisible();
    console.log('called', name, email);
    client = new WsClient({ url: `ws:localhost?name=${name}&email=${email}&dept=${dept}&pid=${pid}` });
    client.onMessage = function (msg) {
        var data = JSON.parse(msg.data);
        if (data.name == undefined) {
            console.log('undefined');
            console.log(data);
            if (data.message != '') {
                incoming_messages += incoming_messages + "&&" + data.message;
                // localStorage.setItem('incoming', incoming_messages);
                document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
        <div class="bubble">
        <p>${data.message}</p>
        </div>`
            }
            document.getElementsByClassName('msg')[0].disabled = true;
            document.getElementById('btn_sendMessage').disabled = true;
            document.getElementById('btn_Attachment').disabled = true;
        }
        else {
            if (data.message != '') {
                incoming_messages += incoming_messages + "&&" + data.message;
                // localStorage.setItem('incoming', incoming_messages);
                document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
        <div class="bubble">
        <p>${data.message}</p>
        </div>`
            }
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
    var message = document.getElementsByClassName("msg")[0].value;
    client.send(message);
    if (message != '') {
        console.log(message);
        outgoing_messages += outgoing_messages + "&&" + message;
        // localStorage.setItem('outgoing', outgoing_messages);
        document.getElementsByClassName('body')[0].innerHTML += `<div class="outgoing">
        <div class="bubble">
        <p>${message}</p>
        </div>`
        document.getElementsByClassName("msg")[0].value = '';
    }
    else {
        alert('type a message');
    }
}

function switchVisible() {
    if (document.getElementsByClassName('info')[0]) {

        if (document.getElementsByClassName('info')[0].style.display == 'none') {
            document.getElementsByClassName('info')[0].style.display = 'block';
            document.getElementsByClassName('body')[0].style.display = 'none';
            document.getElementsByClassName('foot')[0].style.display = 'none';

        }
        else {
            document.getElementsByClassName('info')[0].style.display = 'none';
            document.getElementsByClassName('body')[0].style.display = 'block';
            document.getElementsByClassName('foot')[0].style.display = 'flex';
        }
    }
}


function attach() {
    var fileSelector = document.createElement('input');
    fileSelector.setAttribute('id', 'attached_file');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', '.jpg,.jpeg,.png')
    fileSelector.click();

    // var drawing = document.getElementsByClassName("msg")[0];
    // var con = drawing.getContext("2d");
    // var img = document.getElementById("attached_file");
    // con.drawImage(img, 0, 0, 50, 50);
    // var image2 = new Image();
    // image2.src = "andyGoofy.gif";
    // con.drawImage(image2, 100, 100, 70, 50);


}
