import {
  INIT_PAYMENT,
  DEACTIVATE_PAYMENT,
  SUBMIT_PAYMENT,
  PROCESS_PAYMENT,
  SET_AMOUNT,
} from "../actions/types";

const INITIAL_STATE = { status: null, amount: null, email: null };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_PAYMENT:
      return { ...state, status: action.payload };
    case DEACTIVATE_PAYMENT:
      return { ...state, status: null };
    case PROCESS_PAYMENT:
      return action.payload;
    case SUBMIT_PAYMENT:
      return { ...state, status: "payment_processed" };
    case SET_AMOUNT:
      return { ...state, amount: action.payload };
    default:
      return state;
  }
};
