import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native"
import * as Animatable from "react-native-animatable"
import AsyncStorage from "@react-native-async-storage/async-storage"

import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"

import Colors from "../utils/Colors"
import GlobalStyles from "../utils/GlobalStyles"
import { loadConnect, loadBgConnect } from "../utils/animation"

const ClientLayout = ({ children, navigation, route, setIPChildren }) => {
  const [ip, setIP] = useState("")

  useEffect(() => {
    const getIP = async () => {
      try {
        const ipStorage = await AsyncStorage.getItem("ip")
        if (ipStorage !== null) {
          // Biến id tồn tại trong AsyncStorage
          setIP(ipStorage)
          setIPChildren(ipStorage)
        } else {
          // Biến id không tồn tại trong AsyncStorage
          navigation.navigate("Connect")
          Alert.alert("Cảnh báo!", "Vui lòng nhập địa chỉ IP của bạn!")
        }
      } catch (error) {
        console.log(error)
      }
    }

    getIP()
  }, [navigation, setIPChildren])

  const handleGoBackClick = () => {
    navigation.goBack()
  }

  const handleDisconnectClick = async () => {
    try {
      await AsyncStorage.clear()
      navigation.navigate("Connect", {
        message: `Đã ngắn kết nối với IP: ${ip}`,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={[GlobalStyles.bgScreen, styles.body]}>
      <StatusBar barStyle="light-content" />

      {/*header*/}
      <View style={[GlobalStyles.flexRowBetween, styles.header]}>
        <View>
          {route.name === "TimerAddOrEdit" && (
            <TouchableOpacity onPress={handleGoBackClick}>
              <Ionicons name="chevron-back" style={styles.headerBackIcon} />
            </TouchableOpacity>
          )}
        </View>
        <View style={GlobalStyles.flexRowAlignCenter}>
          <Animatable.View
            animation={loadConnect}
            iterationCount="infinite"
            easing="ease-out"
            duration={2000}
          >
            <View style={styles.headerIconWrapper}>
              <Animatable.View
                style={styles.headerIconLoad}
                animation={loadBgConnect}
                iterationCount="infinite"
                easing="ease-out"
                delay={200}
                duration={2000}
              />
              <View style={styles.headerIcon} />
            </View>
          </Animatable.View>
          <Text style={styles.headerText}>Đang kết nối địa chỉ IP: {ip}</Text>
        </View>
        <TouchableOpacity onPress={handleDisconnectClick}>
          <AntDesign name="disconnect" style={styles.headerDisconnectIcon} />
        </TouchableOpacity>
      </View>
      {/*header*/}

      {/*content*/}
      <View>{children}</View>
      {/*content*/}
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    position: "relative",
  },

  header: {
    backgroundColor: Colors.bgcolorDark,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },

  headerBackIcon: {
    fontSize: 20,
    color: Colors.white,
  },

  headerIconWrapper: {
    borderColor: Colors.primary,
    position: "relative",
  },

  headerIconLoad: {
    position: "absolute",
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: Colors.primary,
    top: -4,
    left: -4,
    opacity: 0.2,
    borderRadius: "100%",
    zIndex: -1,
  },

  headerIcon: {
    width: 10,
    height: 10,
    backgroundColor: Colors.primary,
    borderRadius: "100%",
    marginRight: 10,
  },

  headerText: {
    color: Colors.white,
  },

  headerDisconnectIcon: {
    fontSize: 18,
    color: Colors.white,
  },
})

export default ClientLayout
