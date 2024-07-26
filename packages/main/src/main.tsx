import React from 'react'
import ReactDOM from 'react-dom/client'
import { ManuallyTestInHere } from './manually-test-here.tsx'
import './index.css'

// biome-ignore lint/style/noNonNullAssertion: <just ignore>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ManuallyTestInHere />
  </React.StrictMode>
)
