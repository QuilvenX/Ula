class SimpleAI {
  constructor() {
    this.memory = JSON.parse(localStorage.getItem("aiMemory")) || {};
    this.trained = Object.keys(this.memory).length > 0;
  }

  train(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const [q, a] = line.split("=");
      if (q && a) {
        this.memory[q.toLowerCase()] = a;
      }
    }
    localStorage.setItem("aiMemory", JSON.stringify(this.memory));
    this.trained = true;
    this.log("✅ Training complete. Memory saved.");
  }

  reset() {
    this.memory = {};
    localStorage.removeItem("aiMemory");
    this.trained = false;
    this.log("🗑 Memory reset.");
  }

  respond(input) {
    const key = input.toLowerCase();
    if (this.memory[key]) return this.memory[key];
    return "I don't know that yet, but you can teach me!";
  }

  log(msg) {
    const log = document.getElementById("trainingLog");
    if (log) {
      log.textContent += "\n" + msg;
      log.scrollTop = log.scrollHeight;
    }
  }
}

// UI Logic
const ai = new SimpleAI();
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .tab-content").forEach(el => el.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("chatInput").value.trim();
  if (!input) return;
  addMessage(input, "user");
  const reply = ai.respond(input);
  setTimeout(() => addMessage(reply, "ai"), 300);
  document.getElementById("chatInput").value = "";
});

document.getElementById("trainBtn").addEventListener("click", () => {
  const data = document.getElementById("trainingData").value;
  ai.train(data);
});

document.getElementById("resetBtn").addEventListener("click", () => ai.reset());

function addMessage(text, type) {
  const chatArea = document.getElementById("chatArea");
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-message" : "ai-message";
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}
