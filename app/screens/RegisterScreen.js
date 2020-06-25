import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import { firebase } from "../config/firebaseConfig";
import AuthContext from "../auth/context";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen() {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();

  const { user, setUser } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          fullName,
        };
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            // navigation.navigate('Home', {user: data})
            setUser(data);
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
      <ActivityIndicator visible={registerApi.loading || loginApi.loading} />
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Screen style={styles.container}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="account"
            size={20}
            color={colors.mediumGray}
            style={styles.icon}
          />
          <TextInput
            style={[defaultStyles.text, { flex: 1 }]}
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            autoCorrect={false}
            name="fullName"
            placeholder="Full Name"
            onChangeText={(text) => setFullName(text)}
            value={fullName}
          />
        </View>
        <View style={styles.inputContainer}>
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
            name="email"
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View style={styles.inputContainer}>
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
            name="password"
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="shield-lock"
            size={20}
            color={colors.mediumGray}
            style={styles.icon}
          />
          <TextInput
            style={[defaultStyles.text, { flex: 1 }]}
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none"
            autoCorrect={false}
            name="passwordConfirm"
            placeholder="Confirm Password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
        >
          <Text style={styles.text}>Create account</Text>
        </TouchableOpacity>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 150,
    height: 88.5,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
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
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
  },
});

export default RegisterScreen;
