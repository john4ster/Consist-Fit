import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";

const initialState = {
  userID: JSON.parse(localStorage.getItem("userID")) || null,
  error: false,
}

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(()=>{
    localStorage.setItem("userID", JSON.stringify(state.userID));
  },[state.userID, state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
      userID: state.userID, 
      isAuthenticated: state.isAuthenticated, 
      error: state.error, 
      dispatch, 
    }}>
      {children}
    </AuthContext.Provider>
  )
}