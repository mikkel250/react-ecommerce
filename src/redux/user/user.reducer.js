import UserActionTypes from "./user.types";

const INITIAL_STATE = {
  currentUser: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // stacking case statements that return the same thing
    case UserActionTypes.GOOGLE_SIGN_IN_SUCCESS:
    case UserActionTypes.GOOGLE_SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null
      };
    case UserActionTypes.GOOGLE_SIGN_IN_FAILURE:
    case UserActionTypes.GOOGLE_SIGN_IN_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
