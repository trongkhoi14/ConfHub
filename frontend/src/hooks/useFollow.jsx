import { useState } from 'react'
import { useAppContext } from '../context/authContext'
import { followConferenceAction, unfollowConferenceAction } from '../actions/followAction'
import { convertToLowerCaseFirstLetter } from '../utils/formatWord'

const useFollow = () => {
  const { state, dispatch } = useAppContext()


  const followConference = (conference) => {
    dispatch(followConferenceAction(conference))
  }
  const unfollowConference = (id) => {
    dispatch(unfollowConferenceAction(id))
  }

    return {
      listFollowed: state.listFollowed,
      followConference,
      unfollowConference,
    }
  }


  export default useFollow