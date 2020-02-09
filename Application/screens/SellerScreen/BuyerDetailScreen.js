import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TouchableHighlight
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import DateTimePicker from "react-native-modal-datetime-picker";
import Colors from "../../constants/Colors";
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";
import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";
import * as transactionAction from "../../store/actions/transactionAction";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome
} from "@expo/vector-icons";
import ThaiBoldText from "../../components/ThaiBoldText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { LinearGradient } from "expo-linear-gradient";
import ModalShowAssignedTime from "../../components/ModalShowAssignedTime";
import { Header } from "react-navigation-stack";

const ModalShowImg = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5"
        }}
      >
        <View
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
            borderRadius: 5,
            padding: 5
          }}
        >
          <View
            style={{
              width: "100%",
              height: "80%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
                overflow: "hidden"
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{ uri: props.uri }}
              />
            </View>
          </View>

          <View
            style={{
              width: "100%",
              height: "15%",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <CustomButton
              style={{
                width: "30%",
                maxWidth: 40,
                height: "100%",
                maxHeight: 40,
                borderRadius: 5
              }}
              btnColor={Colors.button.submit_primary_dark.btnBackground}
              onPress={() => {
                props.slideImg(-1);
              }}
              btnTitleColor={Colors.button.submit_primary_dark.btnText}
              btnTitleFontSize={10}
            >
              <Ionicons
                name="ios-arrow-back"
                color={Colors.button.submit_primary_dark.btnText}
                size={10}
              />
              <ThaiMdText style={{ fontSize: 10 }}> </ThaiMdText>
            </CustomButton>

            <CustomButton
              style={{
                width: "30%",
                maxWidth: 80,
                height: "100%",
                maxHeight: 50,
                borderRadius: 5
              }}
              btnColor={Colors.button.cancel.btnBackground}
              onPress={() => {
                props.setIsImgModalVisible(false);
              }}
              btnTitleColor={Colors.button.cancel.btnText}
              btnTitleFontSize={10}
            >
              <MaterialIcons
                name={"cancel"}
                color={Colors.button.cancel.btnText}
                size={10}
              />
              <ThaiMdText style={{ fontSize: 10 }}> ปิดหน้าต่าง</ThaiMdText>
            </CustomButton>

            <CustomButton
              style={{
                width: "30%",
                maxWidth: 40,
                height: "100%",
                maxHeight: 40,
                borderRadius: 5
              }}
              btnColor={Colors.button.submit_primary_dark.btnBackground}
              onPress={() => props.slideImg(1)}
              btnTitleColor={Colors.button.submit_primary_dark.btnText}
              btnTitleFontSize={10}
            >
              <Ionicons
                name="ios-arrow-forward"
                color={Colors.button.submit_primary_dark.btnText}
                size={10}
              />
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BuyerDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const buyerInfomation = props.navigation.getParam("buyerInfomation");

  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={Colors.linearGradientDark}
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%"
      }}
    >
      {props.navigation.getParam("haveHeaderHight") ? null : (
        <CustomStatusBar />
      )}
      <ModalShowImg
        modalVisible={isImgModalVisible}
        onRequestClose={() => console.log("modal close")}
        setIsImgModalVisible={setIsImgModalVisible}
        uri={imgShowInModal}
        slideImg={slideImg}
      />
      {datepickerShow ? (
        <DateTimePicker
          mode="date"
          isVisible={datepickerShow}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
        />
      ) : null}
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.soft_primary_dark,
          paddingVertical: 10,
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <CustomButton
          style={{
            width: "20%",
            height: "100%",
            maxHeight: 30,
            borderRadius: 5
          }}
          btnColor={Colors.button.cancel.btnBackground}
          onPress={backHandler}
          btnTitleColor={Colors.button.cancel.btnText}
          btnTitleFontSize={10}
        >
          <Ionicons
            name={"ios-arrow-back"}
            color={Colors.button.cancel.btnText}
            size={10}
          />
          <ThaiMdText style={{ fontSize: 10 }}> ย้อนกลับ</ThaiMdText>
        </CustomButton>
        <View
          style={{
            width: "50%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ThaiBoldText
            style={{
              color: Colors.on_primary_dark.low_constrast,
              fontSize: 18
            }}
          >
            รายละเอียดคำขอ
          </ThaiBoldText>
        </View>
        <CustomButton
          style={{
            width: "20%",
            height: "100%",
            maxHeight: 30,
            borderRadius: 5
          }}
          btnColor={
            getDisableStatusForBuyer(3, transactionItem.detail.txStatus)
              ? Colors.button.submit_primary_bright.btnBackgroundDisabled
              : Colors.button.submit_primary_bright.btnBackground
          }
          onPress={
            getDisableStatusForBuyer(3, transactionItem.detail.txStatus)
              ? null
              : onBuyerWayHandler
          }
          btnTitleColor={
            getDisableStatusForBuyer(3, transactionItem.detail.txStatus)
              ? Colors.button.submit_primary_bright.btnTextDisabled
              : Colors.button.submit_primary_bright.btnText
          }
          btnTitleFontSize={10}
        >
          <ThaiMdText style={{ fontSize: 10 }}> กำลังไปรับ</ThaiMdText>
        </CustomButton>
      </View>
      <View
        style={{
          height: "20%",
          width: "100%",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: "30%",
            height: "80%",
            padding: 5,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ImageCircle
            imgUrl={transactionItem.imgUrl ? transactionItem.imgUrl : ""}
            avariableWidth={wp("25%")}
          />
        </View>
        <View
          style={{
            width: "70%",
            height: "80%",
            paddingHorizontal: 10,
            justifyContent: "center"
          }}
        >
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {`สถานะ `}
            <ThaiMdText
              style={{
                fontSize: 14,
                color: libary.getColorTxStatus(transactionItem.detail.txStatus)
              }}
            >
              {libary.getReadableTxStatus(transactionItem.detail.txStatus)}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {`สถานที่รับขยะ `}
            <ThaiMdText
              style={{ fontSize: 14, color: Colors.primary_bright_variant }}
            >
              {transactionItem.detail.addr}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText>{transactionItem.tel}</ThaiRegText>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: "5%",
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <View style={{ width: "50%", height: "80%", padding: 5 }}>
          {buyerAssignedTimeFlatList.length > 0 ? (
            <CustomButton
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
                alignSelf: "flex-end"
              }}
              btnColor={Colors.button.submit_primary_bright.btnBackground}
              btnTitleColor={Colors.button.submit_primary_bright.btnText}
              onPress={() => setBuyerAssignedTimeFlatList([])}
              btnTitleFontSize={12}
            >
              <MaterialIcons name={"cancel"} size={12} />
              <ThaiMdText style={{ fontSize: 12 }}> ยกเลิกเสนอเวลา</ThaiMdText>
            </CustomButton>
          ) : (
            <ThaiMdText
              style={{
                fontSize: 12,
                color: Colors.on_primary_dark.low_constrast
              }}
            >
              {transactionItem.detail.txStatus === 0
                ? "เวลาที่ผู้ขายเสนอ"
                : transactionItem.detail.txStatus === 1
                ? "เวลาที่คุณเสนอ"
                : "เวลาที่ตกลงกัน(สีเขียว)"}
            </ThaiMdText>
          )}
        </View>
        <View
          style={{
            width: "50%",
            height: "100%",
            flexDirection: "row",
            padding: 5
          }}
        >
          <CustomButton
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
              alignSelf: "flex-end"
            }}
            btnColor={
              getDisableStatusForBuyer(1, transactionItem.detail.txStatus)
                ? Colors.button.submit_primary_dark.btnBackgroundDisabled
                : Colors.button.submit_primary_dark.btnBackground
            }
            btnTitleColor={
              getDisableStatusForBuyer(1, transactionItem.detail.txStatus)
                ? Colors.button.submit_primary_dark.btnTextDisabled
                : Colors.button.submit_primary_dark.btnText
            }
            onPress={
              getDisableStatusForBuyer(1, transactionItem.detail.txStatus)
                ? null
                : () => showDateTimePicker(true)
            }
            btnTitleFontSize={12}
          >
            <MaterialCommunityIcons
              name={"calendar-multiple-check"}
              size={12}
            />
            <ThaiMdText style={{ fontSize: 12 }}> เสนอเวลาอื่น</ThaiMdText>
          </CustomButton>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: "15%",
          paddingHorizontal: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Colors.soft_primary_dark,
            borderRadius: 5
          }}
        >
          <FlatList
            data={
              buyerAssignedTimeFlatList.length > 0
                ? buyerAssignedTimeFlatList
                : assignedTime
            }
            keyExtractor={item =>
              libary.formatDate(item.toDate()) +
              libary.formatTime(item.toDate())
            }
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={
                    buyerAssignedTimeFlatList.length > 0
                      ? () => deleteBuyerTimeHandler(item)
                      : () => onTimeSelectedHandler(item)
                  }
                >
                  <View style={{ height: 25, padding: 3, alignSelf: "center" }}>
                    <ThaiRegText style={{ fontSize: 18 }}>
                      <ThaiMdText
                        style={{
                          fontSize: 18,
                          color:
                            buyerAssignedTimeFlatList.length > 0
                              ? Colors.primary_bright
                              : transactionItem.detail.chosenTime != undefined
                              ? transactionItem.detail.chosenTime.seconds ===
                                item.seconds
                                ? Colors.soft_primary_bright
                                : Colors.soft_secondary
                              : Colors.soft_secondary
                        }}
                      >
                        {libary.formatDate(item.toDate())}
                      </ThaiMdText>
                      {` `}
                      <ThaiMdText
                        style={{
                          fontSize: 18,
                          color:
                            buyerAssignedTimeFlatList.length > 0
                              ? Colors.primary_bright
                              : transactionItem.detail.chosenTime != undefined
                              ? transactionItem.detail.chosenTime.seconds ===
                                item.seconds
                                ? Colors.soft_primary_bright
                                : Colors.soft_secondary
                              : Colors.soft_secondary
                        }}
                      >
                        {libary.formatTime(item.toDate())}
                      </ThaiMdText>
                      {buyerAssignedTimeFlatList.length > 0 ? (
                        <MaterialIcons
                          name={"cancel"}
                          size={20}
                          color={Colors.primary_bright}
                        />
                      ) : transactionItem.detail.txStatus === 0 ? (
                        <MaterialIcons
                          name={
                            item.seconds === timeSelected.seconds
                              ? "check-box"
                              : "check-box-outline-blank"
                          }
                          size={20}
                          color={Colors.primary_bright}
                        />
                      ) : null}
                    </ThaiRegText>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: "5%",
          padding: 2,
          paddingHorizontal: 10
        }}
      >
        <ThaiMdText
          style={{ fontSize: 12, color: Colors.on_primary_dark.low_constrast }}
        >
          ประเภทขยะที่ขาย
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "15%",
          paddingHorizontal: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Colors.soft_primary_dark,
            borderRadius: 5,
            paddingVertical: 10
          }}
        >
          <FlatList
            data={saleList}
            keyExtractor={item => item.subtype}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    height: 30,
                    padding: 3,
                    alignSelf: "center",
                    flexDirection: "row"
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center"
                    }}
                  >
                    <ThaiRegText
                      style={{ fontSize: 18, color: Colors.soft_secondary }}
                    >
                      <ThaiMdText
                        style={{ fontSize: 18, color: Colors.primary_bright }}
                      >
                        {item.type}
                      </ThaiMdText>
                      {` ประเภท `}
                      <ThaiMdText
                        style={{ fontSize: 18, color: Colors.primary_bright }}
                      >
                        {item.subtype}
                      </ThaiMdText>
                      {` จำนวน `}
                      <ThaiMdText
                        style={{ fontSize: 18, color: Colors.primary_bright }}
                      >
                        {item.amount.amount}
                      </ThaiMdText>
                    </ThaiRegText>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: "5%",
          padding: 2,
          paddingHorizontal: 10
        }}
      >
        <ThaiMdText
          style={{ fontSize: 12, color: Colors.on_primary_dark.low_constrast }}
        >
          รูปภาพขยะ (กดที่ภาพ เพื่อขยาย)
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "10%",
          padding: 2,
          paddingHorizontal: 10
        }}
      >
        <FlatList
          data={imgs}
          keyExtractor={item => item}
          style={{ flex: 1 }}
          horizontal={true}
          renderItem={({ item: uri }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setImgShowInModal(uri);
                  setIsImgModalVisible(true);
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    paddingHorizontal: 2,
                    overflow: "hidden"
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri }}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "15%",
          padding: 5,
          paddingBottom: getStatusBarHeight()
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              maxHeight: 40,
              borderRadius: 5
            }}
            btnColor={
              getDisableStatusForBuyer(4, transactionItem.detail.txStatus)
                ? Colors.button.danger_operation.btnBackgroundDisabled
                : Colors.button.danger_operation.btnBackground
            }
            onPress={
              getDisableStatusForBuyer(4, transactionItem.detail.txStatus)
                ? null
                : cancelHandler
            }
            btnTitleColor={
              getDisableStatusForBuyer(4, transactionItem.detail.txStatus)
                ? Colors.button.danger_operation.btnTextDisabled
                : Colors.button.danger_operation.btnText
            }
            btnTitleFontSize={18}
          >
            <MaterialIcons name={"cancel"} size={14} />
            <ThaiMdText style={{ fontSize: 18 }}> ปฎิเสธ</ThaiMdText>
          </CustomButton>
          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              maxHeight: 40,
              borderRadius: 5
            }}
            btnColor={
              (!timeSelected && buyerAssignedTimeFlatList.length === 0) ||
              getDisableStatusForBuyer(2, transactionItem.detail.txStatus)
                ? Colors.button.submit_primary_bright.btnBackgroundDisabled
                : Colors.button.submit_primary_bright.btnBackground
            }
            onPress={
              (!timeSelected && buyerAssignedTimeFlatList.length === 0) ||
              getDisableStatusForBuyer(2, transactionItem.detail.txStatus)
                ? null
                : acceptHandler
            }
            btnTitleColor={
              (!timeSelected && buyerAssignedTimeFlatList.length === 0) ||
              getDisableStatusForBuyer(2, transactionItem.detail.txStatus)
                ? Colors.button.submit_primary_bright.btnTextDisabled
                : Colors.button.submit_primary_bright.btnText
            }
            btnTitleFontSize={18}
          >
            <MaterialIcons name={"check-box"} size={14} />
            <ThaiMdText style={{ fontSize: 18 }}> ยอมรับ</ThaiMdText>
          </CustomButton>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center"
  },
  userInfo: {
    alignItems: "center"
  },
  userImg: {
    width: "100%",
    height: "100%"
  }
});

/*
Object {
  "detail": Object {
    "addr": "บ้านธรรมรักษา 2 กรุงเทพมหานคร ประเทศไทย 10140",
    "addr_geopoint": Object {
      "geohash": "w4rmwuccf",
      "geopoint": Object {
        "_latitude": 13.6494627,
        "_longitude": 100.4944718,
      },
    },
    "assignedTime": Array [
      Timestamp {
        "nanoseconds": 0,
        "seconds": 1580169600,
      },
    ],
    "buyer": "",
    "createTimestamp": Object {
      "_nanoseconds": 862000000,
      "_seconds": 1580052487,
    },
    "hitMetadata": Object {
      "bearing": 124.45176249258583,
      "distance": 0.0010220999316233553,
    },
    "id": "3mTqURFZ7zBeXfqHetDd",
    "saleList": Object {
      "danger": Object {
        "battery": Object {
          "amount": 20,
        },
      },
      "length": 2,
      "plastic": Object {
        "PETE": Object {
          "amount": 20,
        },
      },
    },
    "seller": "huaweithree",
    "txStatus": 0,
    "txType": 1,
    "zipcode": 10140,
  },
  "txId": "3mTqURFZ7zBeXfqHetDd",
}
*/
