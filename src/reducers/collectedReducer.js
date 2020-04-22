import { CREATE_COLLECTED, FETCH_COLLECTED } from "../actions/types";

export default (state = 0, action) => {
  switch (action.type) {
    case FETCH_COLLECTED:
      let collected = 0;
      action.payload.map((item) => {
        collected += item.amount;
        return collected;
      });
      return collected;
    case CREATE_COLLECTED:
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};
