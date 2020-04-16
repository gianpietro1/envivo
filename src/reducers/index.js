import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import authReducer from "./authReducer";
import streamsReducer from "./streamsReducer";
import tokenReducer from "./tokenReducer";
import commentsReducer from "./commentsReducer";
import paymentReducer from "./paymentReducer";

export default combineReducers({
  auth: authReducer,
  form: reduxFormReducer,
  streams: streamsReducer,
  comments: commentsReducer,
  token: tokenReducer,
  paymentStatus: paymentReducer
});
