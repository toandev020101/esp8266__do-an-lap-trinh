import { useState, useRef, useEffect } from "react"
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native"
import * as Animatable from "react-native-animatable"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-easy-toast"
import { get, ref } from "firebase/database"

import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Ionicons from "react-native-vector-icons/Ionicons"

import Colors from "../utils/Colors"
import GlobalStyles from "../utils/GlobalStyles"
import { loadConnect, loadBgConnect } from "../utils/animation"
import database from "../firebase"

const Connect = ({ navigation, route }) => {
  const [ip, setIP] = useState("")
  const [submited, setSubmited] = useState(false)
  let toastRef = useRef(null)

  useEffect(() => {
    if (route && route.params) {
      const { message } = route.params
      toastRef.show(message, 500)
    }
  }, [route])

  const handleIPChange = (newIP) => {
    if (!newIP) {
      setSubmited(false)
    }

    setIP(newIP)
  }

  const handleConnectSubmit = async () => {
    if (ip) {
      setSubmited(true)
      try {
        const ipArr = ip.split(".")
        const path =
          "esp8266_" +
          ipArr[0] +
          "_" +
          ipArr[1] +
          "_" +
          ipArr[2] +
          "_" +
          ipArr[3]
        const ipRef = ref(database, `/${path}/ip`)
        const snapshot = await get(ipRef)
        const ipDB = snapshot.val()

        if (ip !== ipDB) {
          Alert.alert("Cảnh báo!", "Địa chỉ IP chưa chính xác!")
        } else {
          await AsyncStorage.setItem("ip", ip)
          navigation.navigate("Controll", {
            message: `Đã kết nối thiết bị với IP: ${ip}`,
          })
        }
      } catch (error) {
        console.log(error)
      }

      setIP("")
      setSubmited(false)
    } else {
      Alert.alert("Cảnh báo!", "Vui lòng nhập địa chỉ IP của bạn!")
    }
  }

  return (
    <View style={GlobalStyles.bgScreen}>
      <StatusBar barStyle="light-content" />
      <Toast
        ref={(toast) => (toastRef = toast)}
        style={{ backgroundColor: Colors.white, borderRadius: 20 }}
        positionValue={100}
        opacity={0.8}
        textStyle={{ color: Colors.black }}
      />

      <SafeAreaView style={GlobalStyles.body}>
        {/* header */}
        <View style={[GlobalStyles.flexRowCenter, styles.header]}>
          <FontAwesome5 name="house-damage" style={styles.headerIcon} />
          <Text style={styles.headerText}>Nhà thông minh</Text>
        </View>
        {/* header */}

        {/* content */}
        <View style={[GlobalStyles.flexColumnCenter, styles.content]}>
          <Text style={styles.contentTitle}>Địa chỉ IP của bạn</Text>
          <TextInput
            style={[GlobalStyles.textInput, styles.contentInput]}
            placeholder="192.168.1.1"
            placeholderTextColor={Colors.greyDark}
            keyboardType="numbers-and-punctuation"
            value={ip}
            onChangeText={handleIPChange}
          />

          {!submited || !ip ? (
            <TouchableOpacity
              style={[styles.contentIconWrapper, { borderColor: Colors.white }]}
              onPress={handleConnectSubmit}
            >
              <Ionicons
                name="ios-power"
                style={[styles.contentIcon, { color: Colors.white }]}
              />
            </TouchableOpacity>
          ) : (
            <Animatable.View
              animation={loadConnect}
              iterationCount="infinite"
              easing="ease-out"
              duration={2000}
            >
              <TouchableOpacity
                style={styles.contentIconWrapper}
                onPress={handleConnectSubmit}
              >
                <Animatable.View
                  style={styles.contentIconLoad}
                  animation={loadBgConnect}
                  iterationCount="infinite"
                  easing="ease-out"
                  delay={200}
                  duration={2000}
                />
                <Ionicons name="ios-power" style={styles.contentIcon} />
              </TouchableOpacity>
            </Animatable.View>
          )}
        </View>
        {/* content */}

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Nhóm thực hiện</Text>
          <Text style={styles.footerText}>Đậu Đức Toàn</Text>
          <Text style={styles.footerText}>Lê Hoàng Long</Text>
          <Text style={styles.footerText}>Phạm Đinh Anh Kha</Text>
        </View>
        {/* footer */}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
  },

  headerIcon: {
    color: Colors.white,
    marginRight: 10,
    fontSize: 22,
  },

  headerText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "600",
  },

  content: {
    marginTop: 80,
  },

  contentTitle: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "600",
  },

  contentInput: {
    marginTop: 15,
    textAlign: "center",
  },

  contentIconWrapper: {
    marginTop: 120,
    borderWidth: 4,
    borderRadius: "100%",
    borderColor: Colors.primary,
    padding: 50,
    position: "relative",
  },

  contentIconLoad: {
    position: "absolute",
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: Colors.primary,
    top: -24,
    left: -24,
    opacity: 0.2,
    borderRadius: "100%",
  },

  contentIcon: {
    fontSize: 50,
    color: Colors.primary,
  },

  footer: {
    ...GlobalStyles.flexColumnCenter,
    marginTop: "40%",
  },

  footerText: {
    fontSize: 16,
    color: Colors.white,
  },
})

export default Connect
