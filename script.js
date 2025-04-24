
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("room");

const roomCreator = document.getElementById("room-creator");
const roomJoiner = document.getElementById("room-joiner");
const roomLinkInput = document.getElementById("room-link");

let peer;
let conn;
let call;

function createRoom() {
  const id = Math.random().toString(36).substring(2, 10);
  const link = window.location.origin + window.location.pathname + "?room=" + id;
  roomCreator.style.display = "none";
  roomJoiner.style.display = "block";
  roomLinkInput.value = link;
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

if (roomId) {
  startPeer(roomId);
  setTimeout(() => joinRoom(roomId), 1000);
}
