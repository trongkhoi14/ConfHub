import { useEffect, useState } from "react"
import useFeedback from "../../hooks/useFeedbacks"
import AllFeedbackOfConf from "./AllFeedbackOfConf"
import InputFeedback from "./InputFeedback"
import { useLocation } from "react-router-dom"
import { getIdFromPathname } from "../../utils/getID"


const Feedbacks = () => {
  const {addFeedback} = useFeedback()
  const [id, setId] = useState(null)
  const {pathname} = useLocation()
  useEffect(()=>{
    const idFromPathname = getIdFromPathname(pathname)
    setId(idFromPathname)
  },[pathname])
  return (
    <div className='mt-5 pt-3 pb-5 w-100 border-1 border-top'>
      <span className='fs-5 fw-bold'>Feedbacks</span>
      <InputFeedback onClick={addFeedback} id={id}/>
      <AllFeedbackOfConf/>
    </div>
  )
}

export default Feedbacks