import React, { useEffect, useState, useReducer } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  FlatList,
  BackHandler
} from "react-native";

import Colors from "../../constants/Colors";
import TrashCard from "../../components/TrashCard";
import { useSelector, useDispatch } from "react-redux";

import { chooseBuyerSell } from "../../store/actions/sellerItemsAction";

const SELECT_ITEM = "SELECT_ITEM";
const ADD_TRASH = "ADD_TRASH";
const MINUS_TRASH = "MINUS_TRASH";
const EDIT_TRASH = "EDIT_TRASH";
const SET_TRASH = "SET_TRASH";

const trashSellingReducer = (state, action) => {
  let founded = false;
  let updatedItems = [...state.items];

  switch (action.type) {
    case SET_TRASH:
      return {
        items: [...action.items]
      };
    case SELECT_ITEM:
      updatedItems.forEach((item, index) => {
        if (item.wasteType === action.wasteType)
          updatedItems[index].amount = action.amount;
      });
      return {
        items: updatedItems
      };
    case ADD_TRASH:
      // change or add
      updatedItems.forEach((item, index) => {
        if (item.wasteType === action.wasteType) {
          founded = true;
          updatedItems[index].amount = updatedItems[index].amount + 1;
        }
      });
      if (!founded) {
        updatedItems.push({
          wasteType: action.wasteType,
          amount: 1
        });
      }
      return {
        items: updatedItems
      };
    case MINUS_TRASH:
      // change or add
      updatedItems.forEach((item, index) => {
        if (item.wasteType === action.wasteType) {
          founded = true;
          updatedItems[index].amount = updatedItems[index].amount - 1;
          if (updatedItems[index].amount === 0) updatedItems.splice(index, 1);
        }
      });
      return {
        items: updatedItems
      };
    case EDIT_TRASH:
      // edit from text-input
      updatedItems.forEach((item, index) => {
        if (item.wasteType === action.wasteType) {
          updatedItems[index].amount = action.value;
        }
      });
      return {
        items: updatedItems
      };
      return state;
  }
};

export default SellingTrashScreen = props => {
  // For back behavior
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      props.navigation.navigate("ShowAllUserTrashScreen");
      return true; //Prevent go back to homepage
    });
    return () => {
      BackHandler.removeEventListener();
    };
  });

  // Get data from redux
  // Get User
  const userProfile = useSelector(state => {
    return state.userProfile.user;
  });
  // Get User trash
  const userTrashsFromRedux = useSelector(reducers => {
    return reducers.sellerItems.items;
  });

  const [trashsState, dispatchAmountTrashsState] = useReducer(
    trashSellingReducer,
    {
      txType: "",
      buyer: "buyer temp",
      items: []
    }
  );

  // initially, store data from redux to local redux
  useEffect(() => {
    dispatchAmountTrashsState({ type: SET_TRASH, items: userTrashsFromRedux });
  }, [userTrashsFromRedux, dispatchAmountTrashsState]);

  const dispatch = useDispatch();

  return (
    <View
      style={{
        ...styles.screen,
        flex: 1,
        alignItems: "center"
      }}
    >
      <View
        style={{
          ...styles.allTrashContainer,
          width: "100%",
          height: "80%",
          padding: 10,
          alignItems: "center"
        }}
      >
        <View style={{ width: "100%", height: "100%" }}>
          <FlatList
            style={{
              borderColor: "black",
              borderWidth: 1,
              flex: 1
            }}
            data={trashsState.items}
            keyExtractor={item => item.wasteType}
            renderItem={itemData => (
              <TrashCard
                imgUrl={
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8jHyAAAAAbFxhYVVXV1dUYExXa2tpraWlcWVkgHB3x8fEvLCwNBAegn58FAAAVDxFvbW3i4eG3traJiIimpaW9vLx6eHmcm5vp6eljYWFCP0Dz8/Ovra4qJidOTEyGhYXIyMhST1A3MzRJRkd1c3PEw8SAf3+TGW0NAAAEd0lEQVR4nO2df1uyMBSGgykqSpBp+as0s/r+3/CN94qNUhiDeTwbz/2vwLWbPZwxQXd3BwAAAAAAAHCcx3stq/WtG9mJTZjoCIe3bmQnxlGgI4Uhb2AIQ/70yDA7GyVivwyzxfIv29grwwvD+kTA0AlgCEP+wBCG/JEj/uHv1N63Ed//u7YaYMgcGMKQPz0y9H60wBzfXWAIQ/7AEIb8gSEM+TMQnhs+hoHWMNrcoGG22GVxtWHRvUH4coOmWWKc/UjEyfTsw+ek+DB19p0hmdEgfDz/dCeKDo4G9G2zwvS1UMguXmpP6gQ4mtMPmdHscgwf5AaxkznVd9FO08nMUXW0+jJzO6fajObUFlvmfDbqHtXRzuVUXWL1tyzu5lQN59m8dkNVTwOn6umb6ppl/ZZTOe5nY5q2WWEXy4weddvW3/hwpXFGczYyp6Ez9fQtld1yr996GruX0/diXiT2TTZ3L6cyo0HYrDyOHbs/LdXRBhnNca2eqoyemu5SyunTNZtmh4Oso8mo8U6qnka7K7bNCiqj6ar5XmtVTx+u1zY7tMhozoszOV2ooVA/1pfZFA/841fW4/6wVUZzpqkb9XTbLqM5buR0oeqo+Vf1qp6+sq2npYwuzPdeRzKnH/bbZgdVR7dtduef01Idbfc4aaLqKcucjqRgm4zmrGUn8hz3T90ymlPK6afNptlhpcpM+0eeE1VP2Y37KqNJy4zmzOU8Knm21zY7yLE+DrocZsk2pyqjHf9A4CjrqWBVT0fyfdjk0O1I65TnuC/PvHjveuZ55vReteqt88EGMqczNjmdS8Hky8LRIn71tDR7tXG4Uk6bf9NzXdSbMd0zmnMqzhibP3YpDDMLGc2ZJ1wNrYWq5n2/2wBDY2BIDgyNgSE5MDQGhuTA0BgYkgNDY2BIDgyNgSE5MDQGhuT0yNDsRa9qHrgaiuOkir2+ewdq61nM1DAQlTRoaxrJrWt+W3sbpGE1DdqatdqLhv70of/Xof+1tAfjIQybAkNyYGgMDMmBoTEwJKdHht7fl4r9ZKDQvQL2NaiC79zi1/ww0f010iCpnE2ynR/+QugMJ1a+GaDhYh9mPvah/9eh/7W0B+MhDJsCQ3JgaAwMyYGhMTAkp0eG3t+X+v/80P9nwDXgOf43qRNz/Mpp+0l/HR7V1myvQ/9raQ/GQxg2BYbkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0Bobk+G/4UTTI1pIbR9svWXVl9fNP/5GtdVOKV/dCLkt4yIVSLa2XVqw8z2dxsmlhGEdWFrgoVlaK+Kz1KH/wGqeLzmsWz4/Fu7SpZl12Qj7luilBFnZGnq6I0QrPcl0/m2RsFtL5ZhTG+habwmas+I9ad9qeYMNVvalY2e7FZHNrpb+8pPrfJBgQ8hkpJMOZvW4UoaWFlSyznKWZEHFHhEiSLZdb7jOGh81p1pHTZsFlMbIKdtNOcLkVBQAAADzjH4W+XbnKuWNsAAAAAElFTkSuQmCC"
                }
                wasteType={itemData.item.wasteType.replace("wasteType/", "")}
                wasteDisposal={itemData.item.wasteDisposal}
                wasteDescription={itemData.item.wasteDescription}
                trashDisposal={null} //pro
                amountOfTrash={itemData.item.amount}
                trashAdjustPrice={
                  itemData.item.adjustedPrice
                    ? itemData.item.adjustedPrice
                    : "0.7-0.9"
                }
                dispatchAmountTrashsState={dispatchAmountTrashsState}
                style={styles.eachTrashCard}
                sellingMode={true}
                selectedHandler={() => {
                  return {
                    type: SELECT_ITEM,
                    amount: itemData.item.amount,
                    wasteType: itemData.item.wasteType.replace("wasteType/", "")
                  };
                }}
              />
            )}
          />
          <View>
            <Button
              title={"Sell"}
              onPress={() => {
                // dispatch({
                //   type: "SELLING_TRASH",
                //   addr: userProfile.addr,
                //   buyer: "nonara",
                //   assignedTime: new Date()
                // });
                dispatch(
                  chooseBuyerSell(
                    userProfile.addr,
                    trashsState.items,
                    "nora-buyer",
                    0.5
                  )
                );
              }}
            ></Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.screen
  },
  allTrashContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 10
  },
  eachTrashCard: {
    marginBottom: 5,
    width: "100%",
    height: 100,
    backgroundColor: Colors.on_primary,
    borderRadius: 10
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" }
});
