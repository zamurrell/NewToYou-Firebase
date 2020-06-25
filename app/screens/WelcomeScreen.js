import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState, useContext } from "react";
import * as Yup from "yup";
import authApi from "../api/auth";
import AuthContext from "../auth/context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import { firebase } from "../config/firebaseConfig";
import defaultStyles from "../config/styles";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function WelcomeScreen({ navigation }) {
  const { logIn } = useAuth();
  // const [loginFailed, setLoginFailed] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.");
              return;
            }
            const user = firestoreDocument.data();
            setUser(user);
            // navigation.navigate("Home", { user });
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  // const handleSubmit = async ({ email, password }) => {
  //   const result = await authApi.login(email, password);
  //   if (!result.ok) return setLoginFailed(true);
  //   setLoginFailed(false);
  //   logIn(result.data);
  // };

  // const result = await authApi.login(user.email, user.password);
  // if (!result.ok) return setLoginFailed(true);
  // setLoginFailed(false);
  // logIn(result.data);
  // };

  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require("../assets/image.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
        style={styles.buttonContainer}
      >
        {/* <View style={styles.buttonContainer}> */}
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="email"
            size={20}
            color={colors.mediumGray}
            style={styles.icon}
          />
          <TextInput
            style={[defaultStyles.text, { flex: 1 }]}
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="lock"
            size={20}
            color={colors.mediumGray}
            style={styles.icon}
          />
          <TextInput
            style={[defaultStyles.text, { flex: 1 }]}
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          title="Login"
          onPress={() => onLoginPress()}
          style={styles.button}
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
        {/* <AppButton
          title="Login"
          onPress={() => navigation.navigate(routes.LOGIN)}
        ></AppButton> */}
        <AppButton
          color="secondary"
          title="Register"
          onPress={() => navigation.navigate(routes.REGISTER)}
        ></AppButton>
        {/* </View> */}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 200,
    resizeMode: "contain",
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  input: {
    height: 60,
    width: "100%",
    borderRadius: 35,
    backgroundColor: colors.white,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
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
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default WelcomeScreen;
