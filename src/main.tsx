import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "./amplify"

createRoot(document.getElementById("root")!).render(<App />);
