import firebaseFunctions from "../../utils/firebaseFunctions";
import firebaseUtil from "../../firebase";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGIN = "LOGIN";
export const CREATEACCOUNT = "CREATEACCOUNT";
export const LOGOUT = "LOGOUT";
export const SIGNIN = "SIGNIN";

export const signin = () => {
  return async dispatch => {
    // do async task
    return firebaseFunctions.getUsers().then(result => {
      dispatch({ type: SIGNIN, userProfile: result });
      return;
    });
  };
};

export const signout = () => {
  return async dispatch => {
    // do async task
    return firebaseUtil
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: LOGOUT });
        return true;
      })
      .catch(() => {
        return false;
      });
  };
};
