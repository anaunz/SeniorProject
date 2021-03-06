import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import * as navigationBehaviorAction from "../../store/actions/navigationBehaviorAction";
import ModalShowSellerItemsScreen from "../../components/ModalShowSellerItemsScreen";
import ThaiRegText from "../../components/ThaiRegText";
import AppVariableSetting from "../../constants/AppVariableSetting";
import TrashCard from "../../components/TrashCard";
import Colors from "../../constants/Colors";
import ThaiBoldText from "../../components/ThaiBoldText";
import ModalLoading from "../../components/ModalLoading";

import CustomButton from "../../components/UI/CustomButton";
import CustomStatusBar from "../../components/UI/CustomStatusBar";

const ADD_SELLERITEMS_AMOUNT = "ADD_SELLERITEMS_AMOUNT";
const ADD_NEW_SELLERITEMS_AMOUNT = "ADD_NEW_SELLERITEMS_AMOUNT";
const ADD_NEW_SELLERITEMSCAMERA_AMOUNT = "ADD_NEW_SELLERITEMSCAMERA_AMOUNT";
const MINUS_SELLERITEMS_AMOUNT = "MINUS_SELLERITEMS_AMOUNT";
const SET_LOCAL_SELLERITEMS = "SET_LOCAL_SELLERITEMS";
const EDIT_SELLERITEMS_AMOUNT = "EDIT_SELLERITEMS_AMOUNT";
const CANCEL = "CANCEL";
const UPDATE_LOCAL_SELLERITEMS = "UPDATE_LOCAL_SELLERITEMS";

const trashsModifyingReducer = (state, action) => {
  let sellerItems = state.sellerItems;

  switch (action.type) {
    case SET_LOCAL_SELLERITEMS:
      return {
        ...state,
        sellerItems: action.sellerItems,
        sellerItemsFlatListFormat: [...action.sellerItemsFlatListFormat],
      };
    case ADD_SELLERITEMS_AMOUNT:
      sellerItems.incrementalValue(
        action.majortype,
        action.subtype,
        action.addAmount
      );
      return {
        ...state,
      };
    case ADD_NEW_SELLERITEMS_AMOUNT:
      let addedSellerItem = {
        [action.majortype]: {
          [action.subtype]: action.addAmount,
        },
      };

      sellerItems.addWasteObj(addedSellerItem);
      return {
        ...state,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat(true),
      };
    case ADD_NEW_SELLERITEMSCAMERA_AMOUNT:
      sellerItems.addWasteObj(action.sellerItemsCameraObj);
      return {
        ...state,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat(true),
      };
    case MINUS_SELLERITEMS_AMOUNT:
      sellerItems.incrementalValue(
        action.majortype,
        action.subtype,
        -action.minusAmount
      );
      return {
        ...state,
      };
    case EDIT_SELLERITEMS_AMOUNT:
      sellerItems.editValue(
        action.majortype,
        action.subtype,
        action.value - sellerItems[action.majortype][action.subtype]
      );
      return {
        ...state,
      };
    case UPDATE_LOCAL_SELLERITEMS:
      return {
        ...state,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat(true),
      };
    case CANCEL:
      sellerItems.clearValue();
      return {
        ...state,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat(true),
      };
    default:
      return { ...state };
  }
};

const ShowAllUserTrashScreen = (props) => {
  const [isInOperation, setIsInOperation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // For back behavior + auto refresh
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (editingMode) {
        setEditingMode(false);
        return true; //Prevent go back to homepage
      }
    });

    return () => {
      BackHandler.removeEventListener();
    };
  });

  /*-------------------- DATA -----------------*/
  // trash user snapshot
  const dispatch = useDispatch();
  // Callback fn
  const refreshSellerItems = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(sellerItemsAction.fetchSellerItems());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  // initially
  useEffect(() => {
    // set operation status
    dispatch(navigationBehaviorAction.startOperation());

    // Load sellerItems and wasteType from firebase and store it to redux "initially"
    setIsLoading(true);
    refreshSellerItems()
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }, [refreshSellerItems, dispatch]);

  // Get sellerItems and wasteTyp from redux
  const sellerItems = useSelector((state) => {
    return state.sellerItems.sellerItems;
  });
  const sellerItemsCameraObj = useSelector((state) => {
    return state.sellerItems.sellerItemsCameraObj;
  });
  const sellerItemsFlatListFormat = useSelector((state) => {
    return state.sellerItems.sellerItemsFlatListFormat;
  });
  const wasteTypeDropdownFormat = useSelector((state) => {
    return state.wasteType.wasteTypeDropdownFormat;
  });
  const wasteTypes = useSelector((state) => {
    return state.wasteType.wasteTypes;
  });

  const [trashsState, dispatchAmountTrashsState] = useReducer(
    trashsModifyingReducer,
    {
      sellerItems: {},
      sellerItemsFlatListFormat: [],
    }
  );

  // If redux-data is ready, it will be passed to this local reducer
  useEffect(() => {
    if (sellerItems) {
      dispatchAmountTrashsState({
        type: SET_LOCAL_SELLERITEMS,
        sellerItems,
        sellerItemsFlatListFormat,
      });
    }
  }, [sellerItems]);

  // // If the data sent from optionTrashCheck screen
  useEffect(() => {
    if (
      Object.keys(trashsState.sellerItems).length &&
      Object.keys(sellerItemsCameraObj).length
    ) {
      setEditingMode(true);
      dispatchAmountTrashsState({
        type: ADD_NEW_SELLERITEMSCAMERA_AMOUNT,
        sellerItemsCameraObj,
      });
    }
  }, [
    sellerItemsCameraObj,
    trashsState.sellerItems,
    dispatchAmountTrashsState,
  ]);

  const [modalLoadingText, setModalLoadingText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // error alert handling
  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  const confirmHandlerTricker = useCallback(() => {
    setModalLoadingText("กำลังอัปเดทข้อมูล");
    confirmHandler();
  }, [trashsState, dispatchAmountTrashsState]);

  // For 'addWaste' handler
  const confirmHandler = useCallback(async () => {
    setEditingMode(false);
    setIsInOperation(true);

    trashsState.sellerItems.confirmValue();
    // update new wasteData on local redux
    dispatchAmountTrashsState({
      type: UPDATE_LOCAL_SELLERITEMS,
    });
    // update new wasteData on redux
    await dispatch(
      sellerItemsAction.updateSellerItems(trashsState.sellerItems) //getObject will be run in sellerItemsAction instead
    );
    // clear input data in sellerItemsCamera
    dispatch(sellerItemsAction.clearSellerItemsCamera());
    setIsInOperation(false);
  }, [trashsState, dispatchAmountTrashsState]);

  const cancelHandler = () => {
    setEditingMode(false);
    dispatchAmountTrashsState({ type: "CANCEL" });
    dispatch(sellerItemsAction.clearSellerItemsCamera());
  };

  const sellHandler = () => {
    dispatch(navigationBehaviorAction.startOperation());
    props.navigation.navigate({
      routeName: "SellingTrashScreen",
      params: { sellerItemsNew: trashsState.sellerItems },
    });
  };

  const onSelectedHandler = (waste) => {
    props.navigation.navigate({
      routeName: "WasteDetailScreen",
      params: {
        waste,
      },
    });
  };

  // provide for editing button when operation mode is changed to editing mode
  const [editingMode, setEditingMode] = useState(false);
  useEffect(() => {
    props.navigation.setParams({ editingMode });
    props.navigation.setParams({ setModalVisible });
  }, [editingMode, setModalVisible]);

  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
      </View>
    );
  }

  if (modalVisible) {
    return (
      <ModalShowSellerItemsScreen
        style={{ width: "100%", height: "90%" }}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        wasteTypeDropdownFormat={wasteTypeDropdownFormat}
        wasteTypes={wasteTypes}
        addNewWasteHandler={(majortype, subtype, addAmount) => {
          dispatchAmountTrashsState({
            type: ADD_NEW_SELLERITEMS_AMOUNT,
            majortype,
            subtype,
            addAmount,
          });
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <CustomStatusBar />
      <LinearGradient
        colors={Colors.linearGradientBright}
        style={{
          ...styles.screen,
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight,
          alignItems: "center",
          paddingBottom: getStatusBarHeight(),
        }}
      >
        <ModalLoading
          modalVisible={isInOperation}
          text={modalLoadingText}
          userRole="seller"
        />
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.secondary,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "20%" }}>
            {editingMode ? (
              <CustomButton
                style={{ borderRadius: 5 }}
                btnColor={Colors.button.submit_primary_dark.btnBackground}
                btnTitleColor={Colors.button.submit_primary_dark.btnText}
                onPress={cancelHandler}
                btnTitleFontSize={14}
              >
                <ThaiRegText style={{ fontSize: 10 }}>ยกเลิกแก้ไข</ThaiRegText>
              </CustomButton>
            ) : null}
          </View>
          <View style={{ width: "50%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_secondary.high_constrast,
                fontSize: 18,
              }}
            >
              จำนวนขยะที่คุณมี
            </ThaiBoldText>
          </View>
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {editingMode ? (
              <CustomButton
                style={{ borderRadius: 5 }}
                btnColor={Colors.button.submit_primary_bright.btnBackground}
                btnTitleColor={Colors.button.submit_primary_bright.btnText}
                onPress={confirmHandlerTricker}
                btnTitleFontSize={14}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={10}
                  color={Colors.button.submit_primary_bright.btnText}
                />
                <ThaiRegText style={{ fontSize: 10 }}> ยืนยันแก้ไข</ThaiRegText>
              </CustomButton>
            ) : null}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <FlatList
            data={trashsState.sellerItemsFlatListFormat}
            refreshing={isRefreshing}
            onRefresh={refreshSellerItems}
            style={{
              flex: 1,
            }}
            keyExtractor={(item) => item.subtype}
            renderItem={({ item }) => {
              return (
                <TrashCard
                  onPress={
                    editingMode
                      ? null
                      : () =>
                          onSelectedHandler({
                            imgUrl:
                              wasteTypes[item.type][item.subtype]["imgUrl"],
                            majorType: item.type,
                            subType: item.subtype,
                            wasteName:
                              wasteTypes[item.type][item.subtype]["name"],
                            wasteDisposal:
                              wasteTypes[item.type][item.subtype]["disposal"],
                            wasteDescription:
                              wasteTypes[item.type][item.subtype][
                                "description"
                              ],
                            price: wasteTypes[item.type][item.subtype]["price"],
                          })
                  }
                  style={{ ...styles.eachSellerItemCard }}
                  imgUrl={wasteTypes[item.type][item.subtype]["imgUrl"]}
                  type={item.type}
                  subtype={item.subtype}
                  wasteName={wasteTypes[item.type][item.subtype]["name"]}
                  wasteDisposal={
                    wasteTypes[item.type][item.subtype]["disposal"]
                  }
                  wasteDescription={
                    wasteTypes[item.type][item.subtype]["description"]
                  }
                  wasteTag={wasteTypes[item.type][item.subtype]["trashTag"]}
                  changeAmount={
                    trashsState.sellerItems._count[item.type]
                      ? trashsState.sellerItems._count[item.type][item.subtype]
                      : 0
                  }
                  oldAmount={item.amount}
                  editingValue={(trashsState.sellerItems._count[item.type]
                    ? item.amount +
                        trashsState.sellerItems._count[item.type][
                          item.subtype
                        ] <=
                      0
                      ? 0
                      : item.amount +
                        trashsState.sellerItems._count[item.type][item.subtype]
                    : 0
                  ).toString()}
                  trashAdjustPrice={
                    wasteTypes[item.type][item.subtype]["price"]
                      ? wasteTypes[item.type][item.subtype]["price"]
                      : 0
                  }
                  editingMode={editingMode}
                  onIncrease={() =>
                    dispatchAmountTrashsState({
                      type: ADD_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                      addAmount: 1,
                    })
                  }
                  onDecrease={() => {
                    dispatchAmountTrashsState({
                      type: MINUS_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                      minusAmount: 1,
                    });
                  }}
                  onEdit={(text) => {
                    dispatchAmountTrashsState({
                      type: EDIT_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                      value: text > 0 ? parseInt(text, 10) : 0, //not positive, Nan
                    });
                  }}
                />
              );
            }}
          />
        </View>

        {editingMode || !trashsState.sellerItemsFlatListFormat.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setEditingMode(true);
              setModalVisible(true);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                maxHeight: 50,
                width: wp("94%"),
                backgroundColor: Colors.soft_secondary,
                alignSelf: "center",
                borderRadius: 10,
                padding: 10,
                margin: 5,
                ...styles.shadow,
              }}
            >
              <View style={{ justifyContent: "center", marginHorizontal: 3 }}>
                <AntDesign
                  name="plus"
                  color={Colors.on_secondary.high_constrast}
                  size={25}
                />
              </View>
              <View style={{ justifyContent: "center", marginHorizontal: 3 }}>
                <ThaiBoldText
                  style={{
                    fontSize: 25,
                    color: Colors.on_secondary.high_constrast,
                  }}
                >
                  เพิ่มประเภทขยะ
                </ThaiBoldText>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        {!editingMode && trashsState.sellerItemsFlatListFormat.length > 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "15%",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <CustomButton
                style={{
                  width: "40%",
                  height: "80%",
                  maxHeight: 40,
                  borderRadius: 5,
                }}
                btnColor={Colors.button.start_operation_info.btnBackground}
                onPress={() => {
                  setEditingMode(true);
                }}
                btnTitleColor={Colors.button.start_operation_info.btnText}
                btnTitleFontSize={14}
              >
                <ThaiRegText style={{ fontSize: 12 }}>{"แก้ไขขยะ"}</ThaiRegText>
              </CustomButton>

              <CustomButton
                style={{
                  width: "40%",
                  height: "80%",
                  maxHeight: 40,
                  borderRadius: 5,
                }}
                btnColor={Colors.button.submit_primary_bright.btnBackground}
                onPress={sellHandler}
                btnTitleColor={Colors.button.submit_primary_bright.btnText}
                btnTitleFontSize={14}
              >
                {"ขายขยะ"}
              </CustomButton>
            </View>
          </View>
        ) : null}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.screen,
  },
  eachSellerItemCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});

export default ShowAllUserTrashScreen;
