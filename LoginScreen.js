import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions
} from "react-native";

import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

const appIcon = require("../assets/logo.png");

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userSignedIn: false
    };
  }
  
  signIn = async (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.replace("Dashboard");
      })
      .catch(error => {
        alert(error.message);
      });
  };


  render() {
      SplashScreen.hideAsync();
      const { email, password } = this.state;

      return (
        <View style={styles.container}>
        <ImageBackground
          source={require('../assets/bg.png')}
          style={[
            styles.outContainer,
            {
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
            },
          ]}
          resizeMode="cover">
          <SafeAreaView style={styles.droidSafeArea} />

          <Image source={appIcon} style={styles.appIcon} />

          <TextInput
            style={styles.textinput}
            onChangeText={text => this.setState({ email: text })}
            placeholder={"Enter Email"}
            placeholderTextColor={"#FFFFFF"}
            autoFocus
          />
          <TextInput
            style={[styles.textinput, { marginTop: 20 }]}
            onChangeText={text => this.setState({ password: text })}
            placeholder={"Enter Password"}
            placeholderTextColor={"#FFFFFF"}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={() => this.signIn(email, password)}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.buttonTextNewUser}>NEW USER ?</Text>
          </TouchableOpacity>
          </ImageBackground>
        </View>
      );
    }
  }


const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    
    
  },
  container: {
    flex: 1,
    backgroundColor: "#17181c",
    alignItems: "center",
    justifyContent: "center"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appIcon: {
    width: RFValue(300),
    height: RFValue(300),
    resizeMode: "contain",
    marginBottom: RFValue(10)
  },
  textinput: {
    width: RFValue(250),
    height: RFValue(50),
    padding: RFValue(10),
    borderColor: "#feabc7",
    borderWidth: 3,
    borderRadius: 10,
    fontSize: RFValue(20),
    color: "#ffffff",
    marginTop:20
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#feabc7",
    marginBottom: RFValue(20)
  },
  buttonText: {
    fontSize: RFValue(20),
    color: "#000000",
    fontWeight:"bold"
  },
  buttonTextNewUser: {
    fontSize: RFValue(12),
    color: "#FFFFFF",
    fontWeight:"bold",
    marginBottom: 20,
  }
});

