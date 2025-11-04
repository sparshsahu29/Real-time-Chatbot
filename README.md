#  Realtime Chatbot

A web-based real-time chatbot that uses **OpenAI’s GPT model** with a **Node.js + WebSocket backend** and a simple **HTML/CSS/JS frontend**.

---

##  Features

* Real-time WebSocket communication
* Streamed AI responses
* Typing and connection indicators
* Auto-scroll chat window
* Timestamps for messages
* Responsive, clean UI

---

##  Tech Stack

**Frontend:**

* HTML, CSS, JavaScript (Vanilla)

**Backend:**

* Node.js
* Express
* WebSocket (ws)
* OpenAI API

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/realtime-chatbot.git
cd realtime-chatbot/Backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Add Environment Variables

Create a `.env` file inside `/Backend` based on `.env.example`:

```
OPENAI_API_KEY=sk-your-key-here
PORT=3000
```

### 4️⃣ Start the Server

```bash
node server.js
```

The server should start at:

```
http://localhost:3000
```

### 5️⃣ Open the Frontend

Open `Frontend/index.html` in your browser (or use VS Code Live Server).

---

## 🧰 Project Structure

```
realtime-chatbot/
├── Backend/
│   ├── server.js
│   ├── .env.example
│   ├── package.json
│   └── ...
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

---

