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
  ScrollView,
  ImageBackground,
  Dimensions
} from "react-native";

import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

const appIcon = require("../assets/logo.png");

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name:"",
      last_name:"",
      email: "",
      password: "",
      confirmPassword: "",
      fontsLoaded: false
    };
  }
  
 registerUser = (email, password,confirmPassword,first_name,last_name) => {
  if(password==confirmPassword){
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        Alert.alert("User registered!!");
        console.log(userCredential.user.uid)
        this.props.navigation.replace("Login");
        firebase.database().ref("/users/" + userCredential.user.uid)
                .set({
                  email: userCredential.user.email,
                  first_name: first_name,
                  last_name: last_name,
                  current_theme: "dark"
                })
      })
      .catch(error => {
        Alert.alert(error.message);
      });
    }else{
      Alert.alert("Passwords don't match!");
    }
  };
  

  render() {
      SplashScreen.hideAsync();
      const { email, password, confirmPassword, first_name, last_name } = this.state;
      
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
        <ScrollView>
          <SafeAreaView style={styles.droidSafeArea} />

            <Image source={appIcon} style={styles.appIcon} />
           
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ first_name: text })}
              placeholder={"First name"}
              placeholderTextColor={"#FFFFFF"}
    
            />
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ last_name: text })}
              placeholder={"Last name"}
              placeholderTextColor={"#FFFFFF"}
        
            />
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ email: text })}
              placeholder={"Enter Email"}
              placeholderTextColor={"#FFFFFF"}
  
            />
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ password: text })}
              placeholder={"Enter Password"}
              placeholderTextColor={"#FFFFFF"}
              secureTextEntry
            />
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ confirmPassword: text })}
              placeholder={"Re-enter Password"}
              placeholderTextColor={"#FFFFFF"}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => this.registerUser(email, password, confirmPassword,first_name,last_name)}
            >
              <Text style={styles.buttonText}>REGISTER</Text>
            </TouchableOpacity>    
            <TouchableOpacity
              onPress={()=>this.props.navigation.replace("Login")}
            >
              <Text style={styles.buttonTextNewUser}>LOGIN ?</Text>
            </TouchableOpacity>   
            </ScrollView>   
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
    alignItems:"center",
    justifyContent:"center",
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
    marginTop:20,
    alignSelf:"center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#feabc7",
    marginBottom: RFValue(20),
    alignSelf:"center"
  },
  buttonText: {
    fontSize: RFValue(20),
    color: "#000000",
    fontWeight:"bold"
  },
  buttonTextNewUser: {
    fontSize: RFValue(12),
    color: "#FFFFFF",
    alignSelf:'center',
    fontWeight:"bold",
    marginBottom: 20,
  }
  
});
