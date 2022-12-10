import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./reducers/userReducer";
import { groupReducer } from "./reducers/groupReducer";
import { redirectReducer } from "./reducers/redirectReducer";
import { presentationReducer } from "./reducers/presentationReducer";

const reducer = combineReducers({
  user: userReducer,
  group: groupReducer,
  redirect: redirectReducer,
  presentation: presentationReducer
});

const persistConfig = {
  key: "main-root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const initialState = {};

const middleware = [thunk];

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

const Persistor = persistStore(store);

export { Persistor };
export default store;
