import {
  CREATE_MEDIA,
  SET_STREAM,
  RESET_STREAM,
  TOGGLE_MUTE_AUDIO,
  TOGGLE_MUTE_VIDEO,
} from "../actions/types";

const INITIAL_STATE = {
  token: null,
  channel: null,
  microphoneId: null,
  cameraId: null,
  resolution: null,
  muteVideo: false,
  muteAudio: false,
  uid: null,
  host: null,
  mode: "live",
  codec: "h264",
  streamId: null,
  // beauty: stateCtx.beauty
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_MEDIA:
      return state;
    case SET_STREAM:
      return { ...state, streamId: action.payload };
    case RESET_STREAM:
      return { ...state, streamId: null, muteAudio: false, muteVideo: false };
    case TOGGLE_MUTE_AUDIO:
      return { ...state, muteAudio: !state.muteAudio };
    case TOGGLE_MUTE_VIDEO:
      return { ...state, muteVideo: !state.muteVideo };
    default:
      return state;
  }
};
