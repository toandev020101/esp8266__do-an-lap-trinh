import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Connect from "./screens/Connect"
import Controll from "./screens/Controll"

const Stack = createNativeStackNavigator()

const RootScreen = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Connect"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Connect" component={Connect} />
        <Stack.Screen name="Controll" component={Controll} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootScreen
