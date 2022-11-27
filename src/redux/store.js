import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userReducer } from "./reducers/userReducer";
import { groupReducer } from "./reducers/groupReducer";
import { redirectReducer } from "./reducers/redirectReducer";

const reducer = combineReducers({
  user: userReducer,
  group: groupReducer,
  redirect: redirectReducer
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
