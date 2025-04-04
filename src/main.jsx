import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppThemeProvider } from './contexts/AppThemeContext'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/Store.js'

createRoot(document.getElementById('root')).render(
   <StrictMode>
      <Analytics />
      <ThemeProvider>
         <AppThemeProvider>
            <Provider store={store}>
               <PersistGate loading={null} persistor={persistor}>
                  <App />
               </PersistGate>
            </Provider>
         </AppThemeProvider>
      </ThemeProvider>
   </StrictMode>
)
