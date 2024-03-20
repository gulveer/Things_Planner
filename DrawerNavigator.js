import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile';
import Logout from '../screens/Logout';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Home')}>
          <Image source={'../assets/home.png'} style={styles.drawerItemIcon} />
          <Text style={styles.drawerItemLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Profile')}>
          <Image
            source={'../assets/profile.png'}
            style={styles.drawerItemIcon}
          />
          <Text style={styles.drawerItemLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Logout')}>
          <Image
            source={'../assets/logout.png'}
            style={styles.drawerItemIcon}
          />
          <Text style={styles.drawerItemLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={styles.container}>
      <Drawer.Screen name="Home" component={StackNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17181c',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: 'center',
  },
  drawerItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#feabc7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItemIcon: {
    width: 20,
    height: 20,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;
