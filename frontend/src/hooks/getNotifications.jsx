import { useAppContext } from "../context/authContext"


const getNotifications = () => {
    const {state, dispatch} = useAppContext()
  const handleGetList = async () => {

  }
  return{
    notifications: state.notifications,
    handleGetList
  }
}

export default getNotifications