import { ACTIVATE_PAYMENT, DEACTIVATE_PAYMENT } from "../actions/types";

const INITIAL_STATE = false;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIVATE_PAYMENT:
      return true;
    case DEACTIVATE_PAYMENT:
      return false;
    default:
      return state;
  }
};
