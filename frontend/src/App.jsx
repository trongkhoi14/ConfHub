import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/custom.css'
import './assets/styles/custom_color.css'
import './assets/styles/responsive.css'
import { BrowserRouter} from 'react-router-dom'
import RoutesApp from './routes/RouteApp.jsx'

import MainLayout from './layout/MainLayout.jsx'
import { AppContextProvider } from './context/authContext.jsx'

function App() {

  return (
    <AppContextProvider>
      <BrowserRouter>
        <MainLayout />
        <RoutesApp />
      </BrowserRouter>
    </AppContextProvider>
  )
}

export default App
