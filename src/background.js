import { app, ipcMain, shell } from "electron"
import axios from "axios"

import { createWindow, createStorage, msgServe } from "./init/main"
import currencies from "./currencies"


app.setName("Multicurrency Calculator")


const storageData = createStorage(`${process.cwd()}/data`)


let mainWindow


const createMainWindow = async () => {
    mainWindow = await createWindow("/index.html", {
        bw: {
            width: 800,
            height: 670,
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


ipcMain.on("open-in-browser", (e, url) => {
    shell.openExternal(url)
})


msgServe("get-settings", async () => {
    return await storageData.getJson("settings.json")
})


msgServe("set-settings", async settings => {
    await storageData.setJson("settings.json", settings)
})


msgServe("get-rates", async () => {
    const chunkSize = 10
    const chunks = _.chunk([...currencies.fiat, ...currencies.crypto], chunkSize)
    const result = {}

    for (const chunk of chunks) {
        const res = await axios.get("https://min-api.cryptocompare.com/data/pricemulti", {
            params: {
                fsyms: "USD",
                tsyms: chunk.join(",")
            }
        })
        _.assign(result, res.data.USD)
    }

    return result
})
