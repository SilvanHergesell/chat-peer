import Peer from 'peerjs';

const app = document.getElementById('app');

// Einzeilige Textbox
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Dein Text hier...';
input.id = 'meine-textbox';
app.appendChild(input);

const connectionInput = document.createElement('input');
connectionInput.type = 'text';
connectionInput.placeholder = 'Deine Peer-ID hier...';
connectionInput.id = 'meine-peer-id';
app.appendChild(connectionInput);

const textAnzeige = document.createElement('div');
textAnzeige.id = 'text-anzeige';
textAnzeige.textContent = 'Hier erscheint der Text';
app.appendChild(textAnzeige);


// PeerJS
var peer = new Peer();
peer.on('open', (id) => {
  console.log('Meine Peer-ID:', id);
  textAnzeige.textContent = 'Meine Peer-ID: ' + id;
});

let dataConnection = null;
// start connection
connectionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    dataConnection = peer.connect(connectionInput.value);
  }
});


input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (dataConnection?.open) {
      dataConnection.send(input.value);
    }
  }
});

// except connection
peer.on('connection', (connection) => {
  console.log('Verbindung hergestellt:', connection);
  connection.on('data', (data) => {
    console.log('Empfangen:', data);
    textAnzeige.textContent = data;
  });
})