import {
  getSectionListFormatWasteType,
  editBuyerInfo,
  getPurchaseList,
  querySellers,
  getBuyerInfo
} from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";
import libary from "../../utils/libary";

export const FETCH_PURCHASELIST = "FETCH_PURCHASELIST";
export const EDIT_PURCHASELIST = "EDIT_PURCHASELIST";
export const CONFIRM_CHANGE_PURCHASELIST = "CONFIRM_CHANGE_PURCHASELIST";
export const GET_SELLER_LIST = "GET_SELLER_LIST";

export const fetchBuyerInfo = () => {
  return async dispatch => {
    // wasteType
    wasteListSectionFormat = await getSectionListFormatWasteType();
    purchaseList = await getPurchaseList();
    buyerInfo = await getBuyerInfo();

    dispatch({
      type: FETCH_PURCHASELIST,
      wasteListSectionFormat,
      purchaseList: new Wastes(purchaseList),
      buyerInfo
    });
  };
};

export const editPurchaseList = (type, subtypeIndex, price) => {
  return async dispatch => {
    dispatch({
      type: EDIT_PURCHASELIST,
      majortype: type,
      subtype: subtypeIndex,
      price: parseInt(price, 10)
    });
  };
};

export const updatePurchaseList = (purchaseList, desc, addr, enableSearch) => {
  return async dispatch => {
    /* 
buyerInfo = {
  purchaseList: {
    PP(waste type): 159(price),
    HDPE(waste type): 999(price)
  },
  desc: "description",
  addr: {
    "latitude": number,
    "longitude": number,
    "readable": "E",
  }
} */
    await editBuyerInfo({
      purchaseList: purchaseList.getObject(),
      desc,
      addr,
      enableSearch
    });

    dispatch({ type: CONFIRM_CHANGE_PURCHASELIST, purchaseList });
  };
};

// export const getSellerList = queryData => {
//   return async dispatch => {
//     try {
//       // search buyer
//       let SellerList = await querySellers(queryData);
//       let cleanedFormatSellerList = [];
//       let assignedTimeForUpdatingTx = [];

//       SellerList.forEach((item, index) => {
//         // edit time obj to firebase timeStamp
//         let firebaseAssignedTime = [];
//         item.assignedTime.forEach((time, index) => {
//           let formattedTime = libary.toDate(time._seconds);
//           firebaseAssignedTime.push(formattedTime);
//           assignedTimeForUpdatingTx.push(formattedTime.seconds * 1000);
//         });

//         cleanedFormatSellerList.push({
//           txId: item.id,
//           detail: {
//             ...item,
//             assignedTime: firebaseAssignedTime,
//             assignedTimeForUpdatingTx
//           }
//         });
//       });
//       console.log("cleanedFormatSellerList");
//       console.log(cleanedFormatSellerList);

//       // dispatch
//       dispatch({
//         type: GET_SELLER_LIST,
//         SellerList: cleanedFormatSellerList
//       });
//     } catch (err) {
//       throw new Error(err.message);
//     }
//   };
// };

// let tx = [];
//     querySnapshot.forEach(doc => {
//       tx.push({ txId: doc.id, detail: doc.data() });
//     });
