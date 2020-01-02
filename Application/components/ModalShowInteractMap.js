import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Modal,
  Text,
  TextInput,
  Alert
} from "react-native";
import Colors from "../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import MapView, { Marker } from "react-native-maps";
import { getStatusBarHeight } from "react-native-status-bar-height";

const ASPECT_RATIO = wp("100%") / hp("100%");
const LATITUDE_DELTA = 0.005; //adjust this for initial zoomin-zoomout
const LONGTITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default ModalShowInteractMap = props => {
  const [zoomCord, setZoomCord] = useState({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGTITUDE_DELTA
  });
  const [selectedLocation, setSelectedLocation] = useState();

  const mapRegion = {
    latitude: props.latitude,
    longitude: props.longitude,
    latitudeDelta: zoomCord.latitudeDelta,
    longitudeDelta: zoomCord.longitudeDelta
  };

  const selectLocationHandler = event => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  //   // listen selectedLocation
  //   useEffect(() => {
  //     console.log("selectedLocation and setAddrUserObj...");
  //     console.log(selectedLocation);
  //     props.setAddrUserObj(selectedLocation);
  //     console.log(selectedLocation);
  //   }, [selectedLocation]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle={"overFullScreen"}
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View
        style={{
          width: wp("95%"),
          height: hp("100%"),
          paddingHorizontal: wp("3%")
        }}
      >
        <View
          style={{
            width: "100%",
            height: "80%",
            alignSelf: "center",
            paddingTop: getStatusBarHeight()
          }}
        >
          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={selectLocationHandler}
          >
            {markerCoordinates && (
              <Marker title="Picked Location" coordinate={markerCoordinates} />
            )}
          </MapView>
        </View>
        <View style={{ width: "100%", height: "10%", flexDirection: "row" }}>
          <View
            style={{ width: "40%", height: "100%", paddingVertical: wp("3%") }}
          >
            <Button
              title="ยกเลิก"
              onPress={() => props.setModalVisible(false)}
              color={Colors.primary}
            />
          </View>
          <View
            style={{ width: "40%", height: "100%", paddingVertical: wp("3%") }}
          >
            <Button
              title="ยืนยัน"
              onPress={() => {
                props.setModalVisible(false);
                props.setAddrUserObj(selectedLocation);
              }}
              color={Colors.primary_variant}
            />
          </View>
        </View>
      </View>

      {/* <View style={{ width: wp("30%"), height: hp("10%") }}>
        <Button
          title="Zoom"
          onPress={() => {
            
          }}
        />
      </View> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});