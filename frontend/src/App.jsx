import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/custom.css'
import './assets/styles/custom_color.css'
import './assets/styles/responsive.css'
import { HashRouter} from 'react-router-dom'

import MainLayout from './layout/MainLayout.jsx'
import { AppContextProvider } from './context/authContext.jsx'

function App() {
  return (
    <AppContextProvider>
      <HashRouter>
        <MainLayout />
      </HashRouter>
    </AppContextProvider>
  )
}

export default App
