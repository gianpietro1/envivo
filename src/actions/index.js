import streams from "../apis/streams";
import agoraTokens from "../apis/agoraTokens";
import history from "../history";

import {
  SIGN_IN,
  SIGN_OUT,
  CREATE_STREAM,
  FETCH_STREAM,
  FETCH_STREAMS,
  EDIT_STREAM,
  DELETE_STREAM,
  GET_STREAM_TOKEN,
  CREATE_COMMENT,
  FETCH_COMMENTS,
  DELETE_COMMENT,
  ACTIVATE_PAYMENT,
  DEACTIVATE_PAYMENT
} from "./types";

export const signIn = userId => {
  return {
    type: SIGN_IN,
    payload: userId
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT
  };
};

export const createStream = formValues => async (dispatch, getState) => {
  const { userId } = getState().auth;
  const response = await streams.post("/streams", { ...formValues, userId });
  dispatch({ type: CREATE_STREAM, payload: response.data });
  // Do some programmatic navigation to get the user back to root route
  // We had to migrate from BrowserRouter to (Plain)Router to be able to import our own history
  history.push("/");
};

export const fetchStreams = () => async dispatch => {
  const response = await streams.get("/streams");
  dispatch({ type: FETCH_STREAMS, payload: response.data });
};

export const fetchStream = id => async dispatch => {
  const response = await streams.get(`/streams/${id}`);
  dispatch({ type: FETCH_STREAM, payload: response.data });
};

export const editStream = (id, formValues) => async dispatch => {
  // patch instead of pull so partial forms submission do not eliminate other values
  // patch is for some values, put for all values (according to REST conventions)
  const response = await streams.patch(`/streams/${id}`, formValues);
  dispatch({ type: EDIT_STREAM, payload: response.data });
  history.push("/");
};

export const deleteStream = id => async dispatch => {
  await streams.delete(`/streams/${id}`);
  dispatch({ type: DELETE_STREAM, payload: id });
  history.push("/");
};

export const getStreamToken = channelName => async dispatch => {
  const response = await agoraTokens.get("/rtcToken", {
    params: { channelName: channelName }
  });
  dispatch({ type: GET_STREAM_TOKEN, payload: response.data.key });
};

export const createComment = (streamId, comment) => async (
  dispatch,
  getState
) => {
  const { userId } = getState().auth;
  const date = new Date();
  const response = await streams.post("/comments", {
    comment,
    userId,
    streamId,
    date
  });
  dispatch({ type: CREATE_COMMENT, payload: response.data });
};

export const fetchComments = streamId => async dispatch => {
  const response = await streams.get("/comments", {
    params: {
      streamId
    }
  });
  dispatch({ type: FETCH_COMMENTS, payload: response.data });
};

export const deleteComment = id => async dispatch => {
  await streams.delete(`/comments/${id}`);
  dispatch({ type: DELETE_COMMENT, payload: id });
};

export const activatePayment = () => {
  return {
    type: ACTIVATE_PAYMENT
  };
};

export const deactivatePayment = () => {
  return {
    type: DEACTIVATE_PAYMENT
  };
};
