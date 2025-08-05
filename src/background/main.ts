chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.postMessage({ type: "VISIBLE", visible: true });

    port.onDisconnect.addListener((port) => {
      port.postMessage({ type: "VISIBLE", visible: false });
    });
  }
});