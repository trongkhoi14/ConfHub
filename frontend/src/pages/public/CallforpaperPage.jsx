import React from 'react'
import useConference from '../../hooks/useConferences'

const CallforpaperPage = () => {
  const {conference} = useConference()
  return (
    <div className='px-5 mx-5 pt-4'>
      <span className='fs-4 fw-bold'>Call for paper</span>
      <div style={{textAlign: "justify", textJustify: "inter-word"}}>{conference.callForPapers[0].content}</div>
      <div style={{textAlign: "justify", textJustify: "inter-word"}} className='text-danger'>{conference.callForPapers[0].content}</div>
    </div>
  )
}

export default CallforpaperPage