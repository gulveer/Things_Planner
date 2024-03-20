import React ,{component} from "react";
import {StyleSheet, View, Text} from "react-native";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../screens/Home";
import AddTask from "../screens/AddTask";
import Ionicons from "react-native-vector-icons/Ionicons";
const Tab = createMaterialBottomTabNavigator();


const BottomTabNavigator = () => {
    return (
        <Tab.Navigator 
            barStyle={styles.bottomTabStyle}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'HOME') {
                        iconName = focused
                            ? 'book'
                            : 'book-outline';
                    } else if (route.name === 'ADDTASK') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    }
                    return <Ionicons name={iconName} size={19} color={color} />;
                },
            })}
           
            tabBarOptions={{
                activeTintColor: 'white',
                inactiveTintColor: 'cyan',

            }}>
                <Tab.Screen name="HOME" component={HomeScreen} />
                <Tab.Screen name="ADDTASK" component={AddTask} />
            
            

        </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    
  bottomTabStyle: {
    backgroundColor: "#feabc7",
    height: "7%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute"
    },
    
  });
  
export default BottomTabNavigator

