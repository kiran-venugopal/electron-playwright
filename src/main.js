const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { chromium } = require("playwright");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.

if (require("electron-squirrel-startup")) {
  app.quit();
}

ipcMain.on("event", (_, eventName) => {
  console.log("event", { eventName });
  if (eventName === "start_recording") {
    const recorder = async () => {
      console.log("recorder called");
      const browser = await chromium.launch({ headless: false });
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto("https://example.com");

      await page.exposeFunction("handleEvents", (e) => {
        console.log("Received Event!", e);
      });
      page.exposeBinding;

      await page.evaluate(() => {
        document.addEventListener(
          "click",
          (e) => {
            console.log("called", e);
            window.handleEvents({
              tag: e.target.tagName,
              x: e.pageX,
              y: e.pageY,
              type: e.type,
            });
          },
          true
        );
      });

      await page.evaluate(() => {
        document.addEventListener(
          "mousemove",
          (e) => {
            console.log("called", e);
            window.handleEvents({
              tag: e.target.tagName,
              x: e.pageX,
              y: e.pageY,
              type: e.type,
            });
          },
          true
        );
      });
    };
    recorder();
  }
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
