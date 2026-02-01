import type { Nullable } from "@/types";
import tippy from "tippy.js";

const old = document.getElementById("dict-ext-popup");
if (old) old.remove();

const popup = document.createElement("div");
popup.id = "dict-ext-popup";
popup.style.all = "initial";
document.documentElement.appendChild(popup);

const shadow = popup.attachShadow({ mode: "open" });

const style = document.createElement("style");
style.textContent = `
  .btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: #fff;
    background: #343a40;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .iframe {
    border: none;
    min-width: 400px;
    min-height: 300px;
    border-radius: 8px;
  }
`;
shadow.appendChild(style);

const root = document.createElement("div");
root.style.position = "fixed";
root.style.top = "0";
root.style.left = "0";
root.style.zIndex = "2147483647";
shadow.appendChild(root);

// 搜尋按鈕
const btn = document.createElement("div");
btn.className = "btn";
btn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" 
       width="16" height="16" viewBox="0 0 24 24" fill="none" 
       stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
`;

// 字典UI
const iframe = document.createElement("iframe");
iframe.src = chrome.runtime.getURL("index.html");
iframe.className = "iframe";

// 浮動按鈕
const btnTip = tippy(root, {
  content: btn,
  allowHTML: true,
  interactive: true,
  appendTo: () => root,
  trigger: "manual",
  placement: "bottom-start",
  maxWidth: "none",
  offset: [8, 8],
});

let lastText: Nullable<string>;
let lastRect: Nullable<DOMRect>;

// 浮動字典
const dictTip = tippy(root, {
  content: iframe,
  allowHTML: true,
  interactive: true,
  appendTo: () => root,
  trigger: "manual",
  placement: "bottom-start",
  maxWidth: "none",
});

// 點擊按鈕 → 顯示字典 iframe
btn.addEventListener("click", () => {
  btnTip.hide();

  iframe.src = chrome.runtime.getURL(`index.html?text=${encodeURIComponent(lastText!)}`);
  dictTip.setProps({
    getReferenceClientRect: () => lastRect!,
  });
  dictTip.show();
});

// 清除顯示按鈕以及字典 iframe
function clear() {
  btnTip.hide();
  dictTip.hide();
}

// 選取文字 → 顯示按鈕
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return clear();

  const text = selection.toString().trim();
  if (!text) return clear();
  lastText = text;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  lastRect = rect;
  btnTip.setProps({
    getReferenceClientRect: () => rect,
  });
  btnTip.show();
});
