import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AppVariableSetting from "../../constants/AppVariableSetting";

import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import ThaiBoldText from "../../components/ThaiBoldText";
import { LinearGradient } from "expo-linear-gradient";
import * as transactionAction from "../../store/actions/transactionAction";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import { Header } from "react-navigation-stack";

export default SellingTransactionScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  // Get transactions for initially
  const transactionsDropdownFormat = useSelector(
    (state) => state.transactions.transactionsDropdownFormat
  );
  const userRole = useSelector((state) => state.user.userRole);

  // For looking into transaction detail
  const selectedHandler = (transactionItem) => {
    props.navigation.navigate({
      routeName: "SellingTransactionDetailScreen",
      params: {
        transactionItem,
        haveHeaderHight: true,
      },
    });
  };

  // --------------- loading section --------------------
  // Callback fn
  const refreshTx = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(transactionAction.fetchTransaction(userRole));
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  // initially
  useEffect(() => {
    // Load sellerItems and wasteType from firebase and store it to redux "initially"
    setIsLoading(true);
    refreshTx()
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }, [refreshTx, dispatch]);

  const [txStatus, setTxStatus] = useState(transactionsDropdownFormat[0].value);
  const [txShow, setTxShow] = useState(
    transactionsDropdownFormat[0].transactions
  );
  useEffect(() => {
    let txOld = transactionsDropdownFormat.filter(
      (txs) => txs.value === txStatus
    )[0];
    setTxShow(txOld.transactions.length > 0 ? txOld.transactions : []);
  }, [transactionsDropdownFormat]);

  const onTxStatusDropdownChange = (txStatus) => {
    setTxStatus(txStatus);

    targetDropdownSection = transactionsDropdownFormat.filter(
      (eachDropdownSection) => eachDropdownSection.value === txStatus
    )[0];
    setTxShow(targetDropdownSection.transactions);
  };

  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
      </View>
    );
  }

  return (
    <View
      style={{
        width: wp("100%"),
        height:
          hp("100%") -
          AppVariableSetting.bottomBarHeight -
          Header.HEIGHT +
          getStatusBarHeight(),
      }}
    >
      <LinearGradient
        colors={Colors.linearGradientBright}
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.hard_secondary,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "20%" }}></View>
          <View style={{ width: "50%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_secondary.high_constrast,
                fontSize: 18,
              }}
            >
              รายการขายขยะของคุณ
            </ThaiBoldText>
          </View>
          <View
            style={{
              width: "20%",
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            height: "20%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              ...styles.firstDropdown,
              width: "60%",
              height: 80,
            }}
          >
            <Dropdown
              label="ประเภทของรายการ"
              value={txStatus}
              data={transactionsDropdownFormat} //Plastic, Glass --- [{value: Plastic}, {value: Glass},]
              onChangeText={(thisValue) => {
                onTxStatusDropdownChange(thisValue);
              }}
              animationDuration={50}
              dropdownPosition={1}
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "70%",
            paddingBottom: getStatusBarHeight() * 2,
          }}
        >
          <FlatList
            refreshing={isRefreshing}
            onRefresh={refreshTx}
            data={txShow}
            keyExtractor={(item, index) => item.txId}
            renderItem={({ item }) => (
              <SellTransactionCard
                amountOfType={item.detail.saleList.length}
                imgUrl={""}
                userName={item.detail.buyer}
                userRole={userRole}
                txType={item.detail.txType}
                txStatus={item.detail.txStatus}
                meetDate={libary.formatDate(
                  item.detail.assignedTime[0].toDate()
                )}
                addr={item.detail.addr}
                onPress={() => {
                  selectedHandler(item);
                }}
              />
            )}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({});
