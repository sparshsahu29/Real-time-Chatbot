const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const statusSpan = document.getElementById("connection-status");

let ws;
let reconnectTimeout;

function connectWebSocket() {
  ws = new WebSocket("ws://localhost:3000");
  updateStatus("Connecting...");

  ws.onopen = () => {
    updateStatus("Connected", true);
    console.log("✅ Connected to WebSocket");
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    handleIncomingMessage(msg);
  };

  ws.onclose = () => {
    updateStatus("Disconnected");
    console.warn("🔌 WebSocket disconnected. Reconnecting in 3s...");
    reconnectTimeout = setTimeout(connectWebSocket, 3000);
  };

  ws.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
    ws.close();
  };
}

function updateStatus(text, connected = false) {
  statusSpan.textContent = text;
  if (connected) {
    statusSpan.classList.add("connected");
  } else {
    statusSpan.classList.remove("connected");
  }
}

connectWebSocket();

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

let currentBotMsg = null;

function handleIncomingMessage(msg) {
  switch (msg.type) {
    case "status":
      console.log("Server:", msg.data);
      break;
    case "bot_chunk":
      if (!currentBotMsg) currentBotMsg = appendBotMessage("");
      currentBotMsg.querySelector("div:first-child").textContent += msg.data;
      chatWindow.scrollTop = chatWindow.scrollHeight;
      break;
    case "bot_done":
      currentBotMsg = null;
      disableInput(false);
      break;
    case "error":
      appendBotMessage(`⚠️ Error: ${msg.data}`);
      disableInput(false);
      break;
  }
}

function appendMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  const text = document.createElement("div");
  text.textContent = content;

  const timestamp = document.createElement("div");
  timestamp.classList.add("timestamp");
  timestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  msg.appendChild(text);
  msg.appendChild(timestamp);
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendBotMessage(content) {
  const msg = document.createElement("div");
  msg.classList.add("message", "bot");

  const text = document.createElement("div");
  text.textContent = content;

  const timestamp = document.createElement("div");
  timestamp.classList.add("timestamp");
  timestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  msg.appendChild(text);
  msg.appendChild(timestamp);
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return msg;
}

function disableInput(disabled) {
  userInput.disabled = disabled;
  sendBtn.disabled = disabled;
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text || ws.readyState !== WebSocket.OPEN) return;

  appendMessage(text, "user");
  userInput.value = "";
  disableInput(true);

  ws.send(JSON.stringify({ type: "user_message", data: text }));
}
