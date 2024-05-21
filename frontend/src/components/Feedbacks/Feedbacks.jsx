
import { useParams } from "react-router-dom"
import useFeedback from "../../hooks/useFeedbacks"
import AllFeedbackOfConf from "./AllFeedbackOfConf"
import InputFeedback from "./InputFeedback"


const Feedbacks = () => {
  const {addFeedback} = useFeedback()
  const id = useParams()
  return (
    <div className='mt-5 pt-3 pb-5 w-100 border-1 border-top'>
      <span className='fs-5 fw-bold'>Feedbacks</span>
      <InputFeedback onClick={addFeedback} id={id.id}/>
      <AllFeedbackOfConf/>
    </div>
  )
}

export default Feedbacks