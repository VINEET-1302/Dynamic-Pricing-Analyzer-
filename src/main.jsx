import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { DataProvider } from './data/DataContext.jsx'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter><DataProvider><App /></DataProvider></BrowserRouter>)
