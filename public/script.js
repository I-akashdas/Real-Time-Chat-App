const socket = io();
const nameForm = document.getElementById("nameForm");
const nameInput = document.getElementById("nameInput");
const chatContainer = document.querySelector(".chat-container");
const nameContainer = document.querySelector(".name-form");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chat-box");

let myName = "";


nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  myName = nameInput.value.trim();

  if (myName !== "") {
    socket.emit("new-user-joined", myName);
    nameContainer.style.display = "none";
    chatContainer.style.display = "block";
    appendMessage(`You joined the chat`, "system");
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message === "") return;

  appendMessage(`You: ${message}`, "sent");
  socket.emit("send-message", { username: myName, message });
  messageInput.value = "";
});


socket.on("receive-message", (data) => {
  appendMessage(`${data.username}: ${data.message}`, "received");
});


socket.on("user-joined", (name) => {
  appendMessage(`${name} joined the chat`, "system");
});


function appendMessage(message, type) {
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.innerText = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
