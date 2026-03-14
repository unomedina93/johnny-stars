const { contextBridge, ipcRenderer } = require('electron')

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Push data snapshot to GitHub for the phone dashboard
  pushToGitHub: (payload) => ipcRenderer.invoke('push-to-github', payload),

  // Pull latest data from GitHub (so web dashboard changes show in the app)
  fetchFromGitHub: (payload) => ipcRenderer.invoke('fetch-from-github', payload),

  // Check if device is online
  checkOnline: () => ipcRenderer.invoke('check-online'),
})
