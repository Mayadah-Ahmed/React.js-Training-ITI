import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { InferenceClient } from "@huggingface/inference";

// --- Configuration and constants ---
const HF_MODEL = "deepseek-ai/DeepSeek-V3-0324";
const STORAGE_KEY = "chatsphere_history_v1";
const SYSTEM_PROMPT =
  "You are ChatSphere AI, a helpful, friendly, concise AI assistant.";

// Read token from Vite env (coerce to string)
const HF_TOKEN = String(import.meta.env.VITE_HF_TOKEN || "");

// UI elements
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const welcomeEl = document.getElementById("welcomeScreen");
const exampleBtns = document.querySelectorAll(".example-btn");

let client = null;
let isWaiting = false;
let conversation = []; // {role, content, time}

// Security note for any developer reading the code
// WARNING: For production, do NOT expose API tokens in frontend code. Use a backend proxy.

function initClient() {
  if (!HF_TOKEN) return null;
  try {
    // Pass the token string directly to the InferenceClient constructor
    client = new InferenceClient(HF_TOKEN);
    return client;
  } catch (err) {
    console.error("Failed to initialize InferenceClient", {
      message: err?.message,
    });
    return null;
  }
}

function saveConversation() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch (e) {
    console.warn("Could not save conversation", e);
  }
}

function loadConversation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not load conversation", e);
    return [];
  }
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderMessages() {
  messagesEl.innerHTML = "";
  if (!conversation.length) {
    welcomeEl.style.display = "block";
  } else {
    welcomeEl.style.display = "none";
  }

  conversation.forEach((m) => {
    const wrapper = document.createElement("div");
    wrapper.className =
      m.role === "user"
        ? "d-flex justify-content-end mb-3"
        : "d-flex justify-content-start mb-3";

    const bubble = document.createElement("div");
    bubble.className =
      m.role === "user" ? "msg-bubble user" : "msg-bubble assistant";
    bubble.innerHTML = `<div class="msg-content">${escapeHtml(m.content).replace(/\n/g, "<br/>")}</div><div class="msg-meta text-muted small mt-1">${formatTime(m.time)}</div>`;

    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setWaiting(flag) {
  isWaiting = flag;
  sendBtn.disabled = flag;
  inputEl.disabled = flag;
}

function showError(message) {
  const el = document.createElement("div");
  el.className = "alert alert-danger small";
  el.textContent = message;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function callHfChat(messages) {
  if (!client)
    throw new Error(
      "Missing Hugging Face token. Configure VITE_HF_TOKEN in .env",
    );

  // Try multiple SDK interfaces to stay compatible with versions
  try {
    // Preferred shape: client.chat.completions.create({ model, messages })
    if (
      client.chat &&
      client.chat.completions &&
      typeof client.chat.completions.create === "function"
    ) {
      return await client.chat.completions.create({
        model: HF_MODEL,
        messages,
      });
    }
    // Older or different shape: client.chatCompletion({ model, messages })
    if (typeof client.chatCompletion === "function") {
      return await client.chatCompletion({ model: HF_MODEL, messages });
    }
    // Another fallback: client.chat({ model, messages })
    if (typeof client.chat === "function") {
      return await client.chat({ model: HF_MODEL, messages });
    }

    throw new Error("Unsupported Hugging Face SDK interface.");
  } catch (err) {
    console.error("Hugging Face API error", err);
    throw err;
  }
}

async function sendMessage(text) {
  if (!text || !text.trim()) return;
  const userMsg = { role: "user", content: text.trim(), time: Date.now() };
  conversation.push(userMsg);
  saveConversation();
  renderMessages();

  setWaiting(true);
  showTypingIndicator();

  // build messages for API with system prompt and history
  const apiMessages = [{ role: "system", content: SYSTEM_PROMPT }];
  conversation.forEach((m) => {
    apiMessages.push({ role: m.role, content: m.content });
  });

  try {
    const resp = await callHfChat(apiMessages);

    // normalize response text
    let assistantText = null;
    if (resp?.choices && resp.choices[0] && resp.choices[0].message) {
      assistantText = resp.choices[0].message.content;
    } else if (resp?.output && resp.output[0] && resp.output[0].content) {
      assistantText = resp.output[0].content;
    } else if (resp?.generated_text) {
      assistantText = resp.generated_text;
    } else if (typeof resp === "string") {
      assistantText = resp;
    }

    if (!assistantText) throw new Error("Empty response from AI");

    const assistantMsg = {
      role: "assistant",
      content: assistantText,
      time: Date.now(),
    };
    conversation.push(assistantMsg);
    saveConversation();
    hideTypingIndicator();
    renderMessages();
  } catch (err) {
    hideTypingIndicator();
    setWaiting(false);
    console.error("API call failed", { message: err?.message });
    showError("Unable to get a response from the AI. See console for details.");
    return;
  }

  setWaiting(false);
}

// Typing indicator
let typingEl = null;
function showTypingIndicator() {
  if (typingEl) return;
  typingEl = document.createElement("div");
  typingEl.className = "d-flex justify-content-start mb-3";
  typingEl.innerHTML = `<div class="msg-bubble assistant typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function hideTypingIndicator() {
  if (typingEl) {
    typingEl.remove();
    typingEl = null;
  }
}

// Wire UI
sendBtn.addEventListener("click", async () => {
  const text = inputEl.value;
  inputEl.value = "";
  await sendMessage(text);
});

inputEl.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = inputEl.value;
    inputEl.value = "";
    await sendMessage(text);
  }
});

clearBtn.addEventListener("click", () => {
  conversation = [];
  localStorage.removeItem(STORAGE_KEY);
  renderMessages();
});

exampleBtns.forEach((b) => {
  b.addEventListener("click", async () => {
    const text = b.textContent.trim();
    // place text into the input and send
    inputEl.value = text;
    await sendMessage(text);
  });
});

// Initialization
function boot() {
  // load history
  conversation = loadConversation();
  renderMessages();

  if (!HF_TOKEN) {
    setWaiting(true);
    showError(
      "Missing Hugging Face token. Add VITE_HF_TOKEN to your .env file.",
    );
    return;
  }

  initClient();
}

boot();
