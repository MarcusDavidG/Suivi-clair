import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'leaflet/dist/leaflet.css'
import './styles/leaflet.css'
import { WagmiProvider } from './providers/WagmiProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { Buffer } from 'buffer'

// Polyfill Buffer for viem
window.Buffer = Buffer

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
