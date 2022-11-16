import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL
} from "../../constants/userConstants";

/* eslint-disable import/prefer-default-export */
export const userReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_USER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false
      };
    case LOGIN_SUCCESS:
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case LOGIN_FAIL:
    case REGISTER_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    default:
      return state;
  }
};

// export const forgotPasswordReducer = (state = {}, action) => {
//     switch (action.type) {
//         case FORGOT_PASSWORD_REQUEST:
//         case RESET_PASSWORD_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//                 error: null,
//             };
//         case FORGOT_PASSWORD_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 message: action.payload,
//             };

//         case RESET_PASSWORD_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 success: action.payload,
//             };

//         case FORGOT_PASSWORD_FAIL:
//         case RESET_PASSWORD_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 error: action.payload,
//             };

//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };

//         default:
//             return state;
//     }
// };

// export const userDetailsReducer = (state = { user: {} }, action) => {
//     switch (action.type) {
//         case USER_DETAILS_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//             };
//         case USER_DETAILS_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 user: action.payload,
//             };

//         case USER_DETAILS_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 error: action.payload,
//             };

//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };

//         default:
//             return state;
//     }
// };
