import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './components/LanguageProvider'
import { normalizePath, tabFromPath } from './routes'

const root = document.getElementById('root')!
const isEditor = normalizePath(window.location.pathname) === '/profile/edit'
const app = <StrictMode><LanguageProvider><App initialTab={tabFromPath(window.location.pathname)} initialEditor={isEditor} /></LanguageProvider></StrictMode>

if (isEditor) createRoot(root).render(app)
else hydrateRoot(root, app)
