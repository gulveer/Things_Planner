import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from "./TabNavigator";
import AddTask from "../screens/AddTask";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="AddTask" component={AddTask} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
