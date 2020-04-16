import { GET_STREAM_TOKEN } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_STREAM_TOKEN:
      return action.payload;
    default:
      return state;
  }
};
