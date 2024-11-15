import {SET_PROFILE, UPDATE_PIP_STATUS,SET_GOOGLE_API_STATE, UPDATE_PROFILE, SET_MEETING_TITLE} from "./types"

export const setProfile = (profile) => {
    return {
        type: SET_PROFILE,
        payload: profile
    }
}

export const setMeeting = (meetingTitle) => {
    return {
        type: SET_MEETING_TITLE,
        payload: meetingTitle
    }
}

export const updateProfile = (profile) => {
    return {
        type: UPDATE_PROFILE,
        payload: profile
    }
}

export const setGoogleAPIState = (state) => {
    return {
        type: SET_GOOGLE_API_STATE,
        payload: state
    }
}

export const updatePipStatus = (state) => {
    return {
        type:UPDATE_PIP_STATUS,
        payload: state
    }
}