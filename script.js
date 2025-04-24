let peer;
let conn;

function createRoom() {
  const id = Math.random().toString(36).substring(2, 10);
  const link = window.location.origin + window.location.pathname + "?room=" + id + "&join=true";
  document.getElementById("room-creator").style.display = "none";
  document.getElementById("room-joiner").style.display = "block";
  document.getElementById("room-link").value = link;

  startPeer(id); // Criador da sala
}

function startPeer(id) {
  peer = new Peer(id);
  peer.on("open", () => {
    console.log("Conectado com ID:", peer.id);
  });

  peer.on("call", (incomingCall) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      incomingCall.answer(stream);
      incomingCall.on("stream", remoteStream => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
      });
    });
  });
}

function joinRoom(id) {
  peer = new Peer();
  peer.on("open", () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const outgoingCall = peer.call(id, stream);
      outgoingCall.on("stream", remoteStream => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
      });
    });
  });
}

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("room");
const isJoining = urlParams.get("join") === "true";

if (roomId && isJoining) {
  joinRoom(roomId);
} else if (roomId) {
  startPeer(roomId);
}
