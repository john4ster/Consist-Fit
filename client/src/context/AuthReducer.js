const AuthReducer = (state, action) => {
  switch(action.type) {
    case "LOGIN_START":
      return {
        userID: null,
        error: false,
      }
    case "LOGIN_SUCCESS":
      return {
        userID: action.payload,
        error: false,
      }
    case "LOGIN_FAILURE":
      return {
        userID: null,
        error: action.payload,
      }
      case "LOGOUT":
        return {
          userID: null,
          error: false,
        }
    default:
      return state;
  }
}

export default AuthReducer;