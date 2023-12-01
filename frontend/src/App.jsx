import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store.jsx'
import RoutesApp from './routes/RouteApp.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Provider store={store}>
        <RoutesApp/>
      </Provider>
    </BrowserRouter>
  )
}

export default App
