import * as FileSystem from "expo-file-system";

// import { insertPlace, fetchPlaces } from "../helpers/db";

export const GET_PREDICTION = "GET_PREDICTION";
export const SET_PLACES = "SET_PLACES";

export const getPrediction = image => {
  return async dispatch => {
    console.log("getPrediction is called");
    console.log(image);
    console.log(image.width + " " + image.height);

    // Move to new directory
    const fileName = image.uri.split("/").pop();
    const newImageUrl = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.copyAsync({
        from: image.uri,
        to: newImageUrl
      });
    } catch (err) {
      console.log(err);
      throw err;
    }

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(fileName);
    const type = match ? `image/${match[1]}` : `image`;

    //base64
    let formData = new FormData();

    formData.append("photo", {
      uri: newImageUrl,
      name: fileName,
      type
    });

    console.log("formData, typeof image.base64");
    console.log(typeof image.base64);

    // send an image
    fetch("http://f64b4a39.ngrok.io/predict", {
      method: "POST",
      headers: {
        // "content-type": "multipart/form-data"
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ photo: image.base64 })
    })
      .then(res => console.log(res))
      .catch(error => console.log(error));
  };
};
