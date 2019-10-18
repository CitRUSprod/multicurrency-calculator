import { app } from "electron"

import { createWindow, createStorage, msgServe } from "./init/main"


app.setName("Multicurrency Calculator")


const storageData = createStorage(`${process.cwd()}/data`)


let mainWindow


const createMainWindow = async () => {
    mainWindow = await createWindow("/index.html", {
        bw: {
            width: 800,
            height: 610,
            resizable: false
        }
    })
    mainWindow.on("closed", () => {
        mainWindow = null
    })
}


app.on("ready", async () => {
    await createMainWindow()
})


msgServe("get-settings", async () => {
    return await storageData.getJson("settings.json")
})


msgServe("set-settings", async settings => {
    await storageData.setJson("settings.json", settings)
})
