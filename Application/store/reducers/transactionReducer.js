import {
  FETCH_TRANSACTION,
  FETCH_QUICK_TRANSACTION,
  FETCH_TODAY_TRANSACTION,
  CHANGE_TRANSACTION_STATUS
} from "../actions/transactionAction";

import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";
import libary from "../../utils/libary";

initialState = {
  transactions: [],
  quickTransactions: [],
  transactionsSectionListFormat: [],
  transactionsDropdownFormat: [],
  todayTx: []
};

const getTXSectionListFormat = transactions => {
  let transactionsSectionListFormat = [];
  // create sectionList transactions
  transactions.forEach((transactionMode, index) => {
    let data = [];
    transactionMode.forEach((transaction, index) => {
      data.push(transaction);
    });
    transactionsSectionListFormat.push({
      transactionMode: libary.getReadableTxStatus(index),
      data
    });
  });
  return transactionsSectionListFormat;
};

const getTXDropdownFormat = (alltransactions, userRole) => {
  let txDropdownFormat = [];
  // create sectionList transactions
  alltransactions.forEach((transactionEachStatus, index) => {
    let transactions = [];
    transactionEachStatus.forEach((transaction, index) => {
      transactions.push(transaction);
    });
    txDropdownFormat.push({
      value: libary.getReadableTxStatus(index, userRole),
      transactions
    });
  });
  return txDropdownFormat;
};

export default (state = initialState, action) => {
  let updatedTransactions = [];
  switch (action.type) {
    case FETCH_TRANSACTION:
      console.log("FETCH_TRANSACTION");
      transactionsDropdownFormat = getTXDropdownFormat(
        action.transactions,
        action.userRole
      );
      return {
        ...state,
        transactions: [...action.transactions],
        transactionsDropdownFormat: [...transactionsDropdownFormat]
      };
    case FETCH_QUICK_TRANSACTION:
      console.log("FETCH_QUICK_TRANSACTION - Redux");
      return { ...state, quickTransactions: [...action.quickTransactions] };
    case FETCH_TODAY_TRANSACTION:
      console.log("FETCH_TODAY_TRANSACTION");
      return {
        ...state,
        todayTx: [...action.transactionMode]
      };
    case CHANGE_TRANSACTION_STATUS:
      console.log("CHANGE_TRANSACTION_STATUS");
      updatedTransactions = [...state.transactions];
      let oldStatusIndex = action.updatedDetail.oldStatus;
      let newStatusIndex = action.updatedDetail.newStatus;
      let txType = action.updatedDetail.txType;
      let targetTx = "";
      if (oldStatusIndex === 0 && txType === 1) {
        targetTx = state.quickTransactions.filter(
          tx => tx.txId === action.updatedDetail.txID
        )[0];
        // delete that tx in old status
        state.quickTransactions = state.quickTransactions.filter(
          tx => tx.txId !== action.updatedDetail.txID
        );
      } else {
        // get that tX
        targetTx = updatedTransactions[oldStatusIndex].filter(
          tx => tx.txId === action.updatedDetail.txID
        )[0];
        // delete that tx in old status
        updatedTransactions[oldStatusIndex] = updatedTransactions[
          oldStatusIndex
        ].filter(tx => tx.txId !== action.updatedDetail.txID);
      }

      // insert new tx in new status array
      targetTx.detail.txStatus = newStatusIndex;
      updatedTransactions[newStatusIndex].push(targetTx);

      // update view
      let transactionsDropdownFormat = getTXDropdownFormat(
        updatedTransactions,
        action.updatedDetail.userRole
      );

      return {
        ...state,
        transactions: [...updatedTransactions],
        transactionsDropdownFormat: [...transactionsDropdownFormat]
      };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
