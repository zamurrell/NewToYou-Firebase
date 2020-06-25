import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import uuid from "uuid";

import {
  AppForm as Form,
  AppFormField as FormField,
  AppFormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import UploadScreen from "../screens/UploadScreen";
import { firebase } from "../config/firebaseConfig";
import colors from "../config/colors";
import defaultStyles from "../config/styles";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

const categories = [
  {
    backgroundColor: "#fed330",
    icon: "floor-lamp",
    label: "Furniture",
    value: 1,
  },
  {
    backgroundColor: "#4b7bec",
    icon: "headphones",
    label: "Movies & Music",
    value: 2,
  },
  {
    backgroundColor: "#fc5c65",
    icon: "laptop-mac",
    label: "Gadgets",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "cards",
    label: "Games",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "shoe-formal",
    label: "Clothing",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "basketball",
    label: "Sports",
    value: 6,
  },
  {
    backgroundColor: "#fd9644",
    icon: "car",
    label: "Cars",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "book-open-page-variant",
    label: "Books",
    value: 8,
  },
  {
    backgroundColor: "#778ca3",
    icon: "application",
    label: "Other",
    value: 9,
  },
];

function ListingEditScreen() {
  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [imagePicked, setImagePicked] = useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  const [listings, setListings] = useState([]);

  const listingRef = firebase.firestore().collection("listings");

  useEffect(() => {
    listingRef.onSnapshot(
      (querySnapshot) => {
        const newListings = [];
        querySnapshot.forEach((doc) => {
          const listing = doc.data();
          listing.id = doc.id;
          newListings.push(listing);
        });
        setListings(newListings);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    setSelectedImage({ localUri: pickerResult.uri });
    setImagePicked(pickerResult);
    // handleImagePicked(pickerResult);
  };

  handleImagePicked = async (pickerResult) => {
    try {
      setUploadVisible(true);

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri, title);
        finishPost(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploadVisible(false);
      // finishPost();
    }
  };

  const finishPost = (url) => {
    console.log("Title onPostPress: ", title.replace(/\s+/g, ""));
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      price: price,
      title: title,
      description: description,
      photo: [url],
    };
    listingRef.add(data).catch((error) => {
      alert(error);
    });
    setTitle("");
    setPrice("");
    setDescription("");
  };

  async function uploadImageAsync(uri, imageName) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName);
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  const onPostPress = () => {
    if (title && title.length > 0 && price && price.length > 0) {
      console.log("selectedImage onPostPress: ", selectedImage);
      handleImagePicked(imagePicked);
    }
  };

  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        validationSchema={validationSchema}
        onSubmit={onPostPress}
      >
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.text}>Choose Image</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image
            style={styles.thumbnail}
            source={{ uri: selectedImage.localUri }}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={[defaultStyles.text, { flex: 1 }]}
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            autoCorrect={false}
            name="title"
            placeholder="Title"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
        </View>
        <View style={[styles.inputContainer, { width: "25%" }]}>
          <TextInput
            style={[defaultStyles.text, { flex: 1 }]}
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            autoCorrect={false}
            name="price"
            placeholder="Price"
            onChangeText={(text) => setPrice(text)}
            value={price}
            keyboardType="numeric"
          />
        </View>
        <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          placeholder="Category"
          PickerItemComponent={CategoryPickerItem}
          width="50%"
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[defaultStyles.text, { flex: 1 }]}
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            autoCorrect={false}
            name="description"
            placeholder="Description"
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => onPostPress()}>
          <Text style={styles.text}>Post</Text>
        </TouchableOpacity>
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    height: 60,
    width: "100%",
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
export default ListingEditScreen;

// handleSubmit = async (listing, { resetForm }) => {
//   setProgress(0);
//   setUploadVisible(true);
//   const result = await listingsApi.addListing(
//     { ...listing, location },
//     (progress) => setProgress(progress)
//   );

//   if (!result.ok) {
//     setUploadVisible(false);
//     return alert("Could not save the listing.");
//   }

//   resetForm();
// };

// let openImagePickerAsync = async () => {
//   let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

//   if (permissionResult.granted === false) {
//     alert("Permission to access camera roll is required!");
//     return;
//   }

//   let pickerResult = await ImagePicker.launchImageLibraryAsync();
//   console.log("pickerResult: ", pickerResult);

//   if (pickerResult.cancelled === true) {
//     console.log("cancelled");
//     return;
//   }

//   if (!pickerResult.cancelled) {
//     setSelectedImage({ localUri: pickerResult.uri });
//     const localImageUri = pickerResult.uri;
//     setSelectedImageUri(localImageUri);
//     console.log("selectedImage: ", selectedImage);
//     console.log("selectedImageUri: ", selectedImageUri);
//     console.log("localImageUri: ", localImageUri);
//   }
// };

// const uploadImage = async (uri, imageName) => {
//   setProgress(0);
//   // setUploadVisible(true);
//   const response = await fetch(uri);
//   const blob = await response.blob();

//   var ref = firebase
//     .storage()
//     .ref()
//     .child("images/" + imageName);
//   return ref.put(blob, {
//     onUploadProgress: (progress) => console.log(progress),
//   });
// };
