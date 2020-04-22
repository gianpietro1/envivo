import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import authReducer from "./authReducer";
import streamsReducer from "./streamsReducer";
import tokenReducer from "./tokenReducer";
import commentsReducer from "./commentsReducer";
import paymentReducer from "./paymentReducer";
import mediaReducer from "./mediaReducer";
import collectedReducer from "./collectedReducer";

export default combineReducers({
  auth: authReducer,
  form: reduxFormReducer,
  streams: streamsReducer,
  comments: commentsReducer,
  token: tokenReducer,
  payment: paymentReducer,
  media: mediaReducer,
  collected: collectedReducer,
});
