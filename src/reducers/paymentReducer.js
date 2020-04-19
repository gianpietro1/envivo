import {
  INIT_PAYMENT,
  DEACTIVATE_PAYMENT,
  SUBMIT_PAYMENT,
  PROCESS_PAYMENT,
} from "../actions/types";

const INITIAL_STATE = { status: null, amount: null, email: null };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_PAYMENT:
      return { ...state, status: "payment_init" };
    case DEACTIVATE_PAYMENT:
      return { ...state, status: null };
    case PROCESS_PAYMENT:
      return action.payload;
    case SUBMIT_PAYMENT:
      console.log(action.payload);
      return { ...state, status: "payment_processed" };
    default:
      return state;
  }
};
