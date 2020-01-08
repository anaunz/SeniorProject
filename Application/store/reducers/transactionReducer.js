import { FETCH_TRANSACTION } from "../actions/transactionAction";
import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";

initialState = {
  transactions: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRANSACTION:
      return {
        ...state,
        transactions: [...action.transactionMode[0]]
      };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
