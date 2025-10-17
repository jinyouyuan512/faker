import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './router'
import 'antd/dist/reset.css'
import { AuthProvider } from './AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
)