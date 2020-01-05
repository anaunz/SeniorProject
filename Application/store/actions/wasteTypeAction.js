import { getWasteType } from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";

export const fetchWasteType = () => {
  return async dispatch => {
    let wasteTypes = [];
    wasteTypes = await getWasteType();
    dispatch({ type: FETCH_WASTETYPE, wasteTypes });
  };
};
