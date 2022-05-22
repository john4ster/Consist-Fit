export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (userID) => ({
  type: "LOGIN_SUCCESS",
  payload: userID,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Logout = () => ({
  type: "LOGOUT",
});