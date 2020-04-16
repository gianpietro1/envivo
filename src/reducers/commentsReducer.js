import _ from "lodash";

import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  FETCH_COMMENTS
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_COMMENTS:
      return { ..._.mapKeys(action.payload, "id") };
    case CREATE_COMMENT:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_COMMENT:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
