const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// Dev mode: app is not packaged (run directly with `electron .`)
const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 780,
    minWidth: 900,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: "Johnny's Star Chart ⭐",
    backgroundColor: '#1a237e',
    // Remove default menu bar
    autoHideMenuBar: true,
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    // Uncomment to open devtools during development:
    // win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ─── GitHub Sync IPC Handler ───────────────────────────────────────────────
// Called from renderer when data changes. Uses Octokit to push data.json
// to the GitHub repo so the GitHub Pages dashboard stays up to date.
ipcMain.handle('push-to-github', async (event, { token, username, repo, data }) => {
  try {
    const { Octokit } = await import('@octokit/rest')
    const octokit = new Octokit({ auth: token })

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
    const filePath = 'docs/data.json'

    // Get current file SHA (needed for update vs create)
    let sha
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: username,
        repo,
        path: filePath,
      })
      sha = fileData.sha
    } catch {
      // File doesn't exist yet — will be created
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: username,
      repo,
      path: filePath,
      message: `⭐ Johnny earned points! [${new Date().toLocaleString()}]`,
      content,
      sha,
    })

    return { success: true }
  } catch (err) {
    console.error('GitHub sync failed:', err.message)
    return { success: false, error: err.message }
  }
})

// ─── Network Status Check ──────────────────────────────────────────────────
ipcMain.handle('check-online', async () => {
  try {
    const { net } = require('electron')
    return net.isOnline()
  } catch {
    return false
  }
})
