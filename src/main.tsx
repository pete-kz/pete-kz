import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./app.css"
import "@fontsource/inter/300.css"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/700.css"
import { registerSW } from "virtual:pwa-register"
import i18n from "./i18"

const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm(i18n.t("label.newContentAvailable"))) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    // window.alert('App has been loaded.')
    console.info("[PWA] App has been loaded")
  },
  onRegistered() {
    console.info("[PWA] Service worker registered.")
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </React.StrictMode>,
)
