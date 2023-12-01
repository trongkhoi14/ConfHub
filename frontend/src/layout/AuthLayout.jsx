import { Navigate, useLocation } from "react-router-dom"


export const AuthLayout = ({children}) => {
   

    if(true){
        return <Navigate to='/login' state={{path: location}}/>
    }
    return children
}

