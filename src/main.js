import Peer from 'peerjs';

const app = document.getElementById('app');

// Nachricht eingeben
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Nachricht eingeben und Enter druecken';
input.id = 'meine-textbox';
app.appendChild(input);

// Ziel-Peer-ID eingeben
const connectionInput = document.createElement('input');
connectionInput.type = 'text';
connectionInput.placeholder = 'Deine Peer-ID hier...';
connectionInput.id = 'meine-peer-id';
app.appendChild(connectionInput);

const textAnzeige = document.createElement('div');
textAnzeige.id = 'text-anzeige';
textAnzeige.textContent = 'Status: Warte auf Verbindung';
app.appendChild(textAnzeige);

const peer = new Peer();
peer.on('open', (id) => {
  console.log('Meine Peer-ID:', id);
  textAnzeige.textContent = 'Meine Peer-ID: ' + id;
});

let dataConnection = null;

function setupConnection(conn) {
  dataConnection = conn;

  conn.on('open', () => {
    console.log('Verbindung offen mit:', conn.peer);
    textAnzeige.textContent = 'Verbunden mit: ' + conn.peer;
  });

  conn.on('data', (data) => {
    console.log('Empfangen:', data);
    textAnzeige.textContent = 'Empfangen: ' + data;
  });

  conn.on('error', (err) => {
    console.error('Verbindungsfehler:', err);
    textAnzeige.textContent = 'Fehler: ' + err.message;
  });

  conn.on('close', () => {
    console.log('Verbindung geschlossen');
    textAnzeige.textContent = 'Status: Verbindung geschlossen';
    dataConnection = null;
  });
}

// Verbindung zu einer Peer-ID aufbauen
connectionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const targetId = connectionInput.value.trim();
    if (!targetId) {
      textAnzeige.textContent = 'Bitte eine Peer-ID eingeben';
      return;
    }

    const conn = peer.connect(targetId);
    setupConnection(conn);
  }
});

// Nachricht senden
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (dataConnection?.open) {
      const message = input.value.trim();
      if (!message) {
        return;
      }
      dataConnection.send(message);
      textAnzeige.textContent = 'Gesendet: ' + message;
      input.value = '';
    } else {
      textAnzeige.textContent = 'Noch nicht verbunden';
    }
  }
});

// Eingehende Verbindung annehmen
peer.on('connection', (conn) => {
  console.log('Eingehende Verbindung von:', conn.peer);
  setupConnection(conn);
});

peer.on('error', (err) => {
  console.error('Peer-Fehler:', err);
  textAnzeige.textContent = 'Peer-Fehler: ' + err.message;
});