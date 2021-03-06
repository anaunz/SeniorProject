import React, { useEffect, useCallback, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  SectionList,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../../constants/AppVariableSetting";
import * as transactionAction from "../../store/actions/transactionAction";

import { useDispatch } from "react-redux";

import CustomStatusBar from "../../components/UI/CustomStatusBar";
import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import ThaiRegText from "../../components/ThaiRegText";
import SellTransactionCard from "../../components/SellTransactionCard";
import ThaiBoldText from "../../components/ThaiBoldText";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default SearchQuicksellingScreen = (props) => {
  const dispatch = useDispatch();
  const purchaseList = useSelector((state) => state.buyerInfo.purchaseList); // sure data is ready
  const buyerAddr = useSelector((state) => state.user.userProfile.addr);

  useEffect(() => {
    if (purchaseList != undefined)
      if (Object.keys(purchaseList).length > 0 && buyerAddr) loadSeller();
  }, [purchaseList, buyerAddr]);

  // Callback fn
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [distance, setDistance] = useState("10");
  const loadSeller = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(
      transactionAction.fetchQuickTransaction({
        distance: Number(distance),
        saleList: purchaseList.getObject(),
        addr: buyerAddr,
      })
    );
    setIsRefreshing(false);
  }, [dispatch, buyerAddr, distance]);
  const quickTransactions = useSelector(
    (state) => state.transactions.quickTransactions
  ); // sure data is ready

  // For looking into transaction detail
  const selectedHandler = (transactionItem) => {
    props.navigation.navigate({
      routeName: "BuyingTransactionDetailScreen",
      params: {
        transactionItem,
      },
    });
  };

  return (
    <View
      style={{
        width: wp("100%"),
        height:
          hp("100%") -
          AppVariableSetting.bottomBarHeight +
          getStatusBarHeight(),
      }}
    >
      <CustomStatusBar />
      <View
        style={{
          width: "100%",
          height: "10%",
          flexDirection: "row",
          backgroundColor: Colors.hard_primary_dark,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View style={{ width: "20%" }} />
        <View style={{ width: "50%", alignItems: "center" }}>
          <ThaiBoldText
            style={{
              color: Colors.on_primary_dark.low_constrast,
              fontSize: 18,
            }}
          >
            คำขอขายขยะด่วน
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
          height: "10%",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: Colors.soft_primary_dark,
        }}
      >
        <View
          style={{
            width: "40%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <ThaiRegText
            style={{
              fontSize: 12,
              color: Colors.on_primary_dark.low_constrast,
            }}
          >
            ค้นหาในระยะ{" "}
          </ThaiRegText>
          <TextInput
            style={{
              fontSize: 14,
              textAlign: "center",
              color: Colors.on_primary_dark.high_constrast,
            }}
            selectTextOnFocus={true}
            value={distance}
            onChangeText={(value) => setDistance(value)}
            keyboardType="number-pad"
          />
          <ThaiRegText
            style={{
              fontSize: 12,
              color: Colors.on_primary_dark.low_constrast,
            }}
          >
            {" "}
            กิโลเมตร
          </ThaiRegText>
        </View>
        <CustomButton
          style={{
            width: "40%",
            height: "100%",
            borderRadius: 8,
            maxHeight: 50,
          }}
          btnColor={Colors.button.submit_primary_dark.btnBackground}
          btnTitleColor={Colors.button.submit_primary_dark.btnText}
          btnTitleFontSize={14}
          onPress={loadSeller}
        >
          <MaterialCommunityIcons
            name={"account-search"}
            size={12}
            color={Colors.button.start_operation_info.btnText}
          />
          <ThaiRegText
            style={{
              fontSize: 12,
            }}
          >
            {` ค้นหาคำขอใหม่`}
          </ThaiRegText>
        </CustomButton>
      </View>
      <LinearGradient
        colors={Colors.linearGradientDark}
        style={{
          width: "100%",
          height: "80%",
          alignSelf: "center",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <FlatList
          refreshing={isRefreshing}
          onRefresh={loadSeller}
          data={quickTransactions ? quickTransactions : []}
          keyExtractor={(item) => item.txId}
          renderItem={({ item }) => {
            return (
              <SellTransactionCard
                amountOfType={item.detail.saleList.length}
                imgUrl={
                  "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
                }
                txStatus={item.detail.txStatus}
                userName={item.detail.seller}
                addr={item.detail.addr}
                onPress={() => {
                  selectedHandler(item);
                }}
                meetDate={libary.formatDate(
                  item.detail.assignedTime[0].toDate()
                )}
              />
            );
          }}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({});
