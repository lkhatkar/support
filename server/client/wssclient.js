var client;
function connect(name, email, dept = 'crane', pid = 'dummy') {
    switchVisible();
    console.log('called', name, email);
    client = new WssClient({ url: `ws:localhost?name=${name}&email=${email}&dept=${dept}&pid=${pid}` });
    client.onMessage = function (msg) {
        console.log(msg);
        var data = JSON.parse(msg.data);
        if (data.message != '') {
            document.getElementsByClassName('body')[0].innerHTML += `<div class="incoming">
        <div class="bubble">
        <p>${data.message}</p>
        </div>`
        }
    }
}

class WssClient {
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
        this.webSocket.send(JSON.stringify(message));
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
