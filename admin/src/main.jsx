import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './lib/redux/store'  // ← STORE IMPORT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>  {/* ← REDUX PROVIDER */}
        <App />

    </Provider>
  </StrictMode>,
)