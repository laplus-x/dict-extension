let activePort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    activePort = port;

    activePort?.postMessage({ type: "VISIBLE", visible: true });

    port.onDisconnect.addListener(() => {
      activePort?.postMessage({ type: "VISIBLE", visible: false });
      activePort = null;
    });
  }
});