const old = document.getElementById("dict-ext-popup");
if (old) old.remove();

const popup = document.createElement("div");
popup.id = "dict-ext-popup";
popup.style.position = "absolute";
popup.style.zIndex = "2147483647";
document.body.appendChild(popup);

const shadow = popup.attachShadow({ mode: "open" });

const btn = document.createElement("div");
btn.style.width = "32px";
btn.style.height = "32px";
btn.style.borderRadius = "50%";
btn.style.color = "#fff";
btn.style.background = "#343a40";
btn.style.display = "flex";
btn.style.alignItems = "center";
btn.style.justifyContent = "center";
btn.style.cursor = "pointer";
btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
btn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" 
       width="16" height="16" viewBox="0 0 24 24" fill="none" 
       stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
`;
shadow.appendChild(btn);

const iframe = document.createElement("iframe");
iframe.src = chrome.runtime.getURL("index.html");
iframe.style.position = "absolute";
iframe.style.zIndex = "2147483647";
iframe.style.border = "none";
iframe.style.minWidth = "400px";
iframe.style.minHeight = "300px";
iframe.style.borderRadius = "8px";
iframe.style.display = "none";
shadow.appendChild(iframe);

btn.onclick = () => {
  btn.style.display = "none";
  iframe.style.display = "block";

  const rect = popup.getBoundingClientRect();
  const margin = 5;
  const width = 450;
  const height = 350;

  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + margin;

  // 右邊界檢查
  if (left + width > window.innerWidth) {
    left = window.innerWidth - width - margin;
  }

  // 底部檢查
  if (top + height > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - height - margin;
  }

  // 左邊界檢查
  if (left < margin) {
    left = margin;
  }

  // 上邊界檢查
  if (top < margin + window.scrollY) {
    top = rect.bottom + window.scrollY + margin; // fallback
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;

  chrome.runtime.sendMessage({ type: "VISIBLE", visible: true });
};

function clear() {
  popup.style.display = "none";
  iframe.style.display = "none";
  btn.style.display = "flex";
  chrome.runtime.sendMessage({ type: "VISIBLE", visible: false });
}

document.addEventListener("mouseup", (e) => {
  if (popup.contains(e.target as Node)) return;

  const selection = window.getSelection();
  if (!selection) return clear()

  const text = selection?.toString().trim();
  if (!text) return clear()

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const margin = 5;

  const left = rect.left + window.scrollX;
  const top = rect.bottom + window.scrollY + margin;

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.style.display = "block";

  chrome.runtime.sendMessage({ type: "QUERY", text });
});
