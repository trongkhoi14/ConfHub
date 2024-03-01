import React from 'react'
import { useAppContext } from '../context/authContext'
import { followConferenceAction, unfollowConferenceAction } from '../actions/followAction'

const useFollow = () => {
    const {state, dispatch} = useAppContext()
    const followConference = (conference) =>{
        console.log('follow', conference)
        dispatch(followConferenceAction(conference))
    }
    const unfollowConference = (id) =>{
        console.log('unfollow', id)
        dispatch(unfollowConferenceAction(id))
    }
  return {
    listFollowed: state.listFollowed,
    followConference,
    unfollowConference,
  }
}

export default useFollow