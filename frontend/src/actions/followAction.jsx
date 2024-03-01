import { FOLLOW, UNFOLLOW } from "./actionTypes";

export const followConferenceAction = (conference) => {
    return {
      type: FOLLOW,
      payload: conference,
    };
};

export const unfollowConferenceAction = (id) => {
    return {
      type: UNFOLLOW,
      payload: id,
    };
};