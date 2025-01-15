import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css";
import { App } from './App'
import { Theme } from "@radix-ui/themes";

// import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark">
      <App />
    </Theme>
  </StrictMode>,
)
