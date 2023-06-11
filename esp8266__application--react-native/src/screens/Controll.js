import { useState, useRef, useEffect } from "react"
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native"
import axios from "axios"
import Toast from "react-native-easy-toast"
import { set, ref, onValue, off } from "firebase/database"

import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

import Colors from "../utils/Colors"
import GlobalStyles from "../utils/GlobalStyles"
import ClientLayout from "../layouts/ClientLayout"
import database from "../firebase"

const Controll = ({ navigation, route }) => {
  let toastRef = useRef(null)
  const [ip, setIP] = useState("")
  const [path, setPath] = useState("")
  const [message, setMessage] = useState("")
  const [isSetup, setIsSetup] = useState(true)

  const [ledPK, setLedPK] = useState(false)
  const [doorPK, setDoorPK] = useState(false)
  const [ledPVS, setLedPVS] = useState(false)
  const [ledPN, setLedPN] = useState(false)

  useEffect(() => {
    const ipArr = ip.split(".")
    const newPath =
      "esp8266_" + ipArr[0] + "_" + ipArr[1] + "_" + ipArr[2] + "_" + ipArr[3]
    setPath(newPath)

    const ledPKRef = ref(database, `/${newPath}/ledPK`)
    const doorPKRef = ref(database, `/${newPath}/doorPK`)
    const ledPVSRef = ref(database, `/${newPath}/ledPVS`)
    const ledPNRef = ref(database, `/${newPath}/ledPN`)

    const setupListeners = () => {
      onValue(ledPKRef, (snapshot) => {
        const ledPKDB = snapshot.val()
        setLedPK(ledPKDB)
      })

      onValue(doorPKRef, (snapshot) => {
        const doorPKDB = snapshot.val()
        setDoorPK(doorPKDB)
      })

      onValue(ledPVSRef, (snapshot) => {
        const ledPVSDB = snapshot.val()
        setLedPVS(ledPVSDB)
      })

      onValue(ledPNRef, (snapshot) => {
        const ledPNDB = snapshot.val()
        setLedPN(ledPNDB)
      })
    }

    setupListeners()

    // Cleanup: Hủy đăng ký lắng nghe khi component unmount
    return () => {
      off(ledPKRef)
      off(doorPKRef)
      off(ledPVSRef)
      off(ledPNRef)
    }
  }, [ip])

  useEffect(() => {
    if (!isSetup) {
      setMessage(`Đã ${ledPK ? "bật" : "tắt"} đèn phòng khách`)
    } else {
      setIsSetup(false)
    }
  }, [ledPK])

  useEffect(() => {
    if (!isSetup) {
      setMessage(`Đã ${doorPK ? "mở" : "đóng"} cửa ra vào`)
    } else {
      setIsSetup(false)
    }
  }, [doorPK])

  useEffect(() => {
    if (!isSetup) {
      setMessage(`Đã ${ledPVS ? "bật" : "tắt"} đèn phòng vệ sinh`)
    } else {
      setIsSetup(false)
    }
  }, [ledPVS])

  useEffect(() => {
    if (!isSetup) {
      setMessage(`Đã ${ledPN ? "bật" : "tắt"} đèn phòng ngủ`)
    } else {
      setIsSetup(false)
    }
  }, [ledPN])

  useEffect(() => {
    if (route && route.params) {
      const { message } = route.params
      toastRef.show(message, 500)
    }
  }, [route])

  useEffect(() => {
    if (message && toastRef) {
      toastRef.show(message, 500)
    }
  }, [message, toastRef])

  const handleLedPKClick = async () => {
    try {
      const ledPKRef = ref(database, `/${path}/ledPK`)

      // dữ liệu mới
      const newData = !ledPK
      await set(ledPKRef, newData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDoorPKClick = async () => {
    try {
      const doorPKRef = ref(database, `/${path}/doorPK`)

      // dữ liệu mới
      const newData = !doorPK
      await set(doorPKRef, newData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLedPVSClick = async () => {
    try {
      const ledPVSRef = ref(database, `/${path}/ledPVS`)

      // dữ liệu mới
      const newData = !ledPVS
      await set(ledPVSRef, newData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLedPNClick = async () => {
    try {
      const ledPNRef = ref(database, `/${path}/ledPN`)

      // dữ liệu mới
      const newData = !ledPN
      await set(ledPNRef, newData)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ClientLayout navigation={navigation} route={route} setIPChildren={setIP}>
      <Toast
        ref={(toast) => (toastRef = toast)}
        style={{ backgroundColor: Colors.white, borderRadius: 20 }}
        positionValue={160}
        opacity={0.8}
        textStyle={{ color: Colors.black }}
      />

      <Image
        source={require("../assets/images/controll-image.jpg")}
        style={styles.controllImage}
        resizeMode="contain"
      />
      {/* item */}
      <View style={styles.controllItem}>
        <Text style={styles.controllItemTitle}>Phòng khách</Text>
        <View style={GlobalStyles.flexRowEvenly}>
          <TouchableOpacity
            style={GlobalStyles.flexColumnCenter}
            onPress={handleLedPKClick}
          >
            <FontAwesome5
              name="lightbulb"
              style={
                ledPK
                  ? [styles.controllItemBtnIcon, { color: Colors.primary }]
                  : styles.controllItemBtnIcon
              }
            />
            <Text
              style={
                ledPK
                  ? [styles.controllItemBtnText, { color: Colors.primary }]
                  : styles.controllItemBtnText
              }
            >
              Đèn: {ledPK ? "Bật" : "Tắt"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={GlobalStyles.flexColumnCenter}
            onPress={handleDoorPKClick}
          >
            <FontAwesome5
              name={doorPK ? "door-open" : "door-closed"}
              style={
                doorPK
                  ? [styles.controllItemBtnIcon, { color: Colors.primary }]
                  : styles.controllItemBtnIcon
              }
            />
            <Text
              style={
                doorPK
                  ? [styles.controllItemBtnText, { color: Colors.primary }]
                  : styles.controllItemBtnText
              }
            >
              Cửa ra vào: {doorPK ? "Mở" : "Đóng"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* item */}

      {/* item */}
      <View style={styles.controllItem}>
        <Text style={styles.controllItemTitle}>Phòng Ngủ</Text>
        <View style={GlobalStyles.flexRowEvenly}>
          <TouchableOpacity
            style={GlobalStyles.flexColumnCenter}
            onPress={handleLedPNClick}
          >
            <FontAwesome5
              name="lightbulb"
              style={
                ledPN
                  ? [styles.controllItemBtnIcon, { color: Colors.primary }]
                  : styles.controllItemBtnIcon
              }
            />
            <Text
              style={
                ledPN
                  ? [styles.controllItemBtnText, { color: Colors.primary }]
                  : styles.controllItemBtnText
              }
            >
              Đèn: {ledPN ? "Bật" : "Tắt"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* item */}

      {/* item */}
      <View style={styles.controllItem}>
        <Text style={styles.controllItemTitle}>Phòng vệ sinh</Text>
        <View style={GlobalStyles.flexRowEvenly}>
          <TouchableOpacity
            style={GlobalStyles.flexColumnCenter}
            onPress={handleLedPVSClick}
          >
            <FontAwesome5
              name="lightbulb"
              style={
                ledPVS
                  ? [styles.controllItemBtnIcon, { color: Colors.primary }]
                  : styles.controllItemBtnIcon
              }
            />
            <Text
              style={
                ledPVS
                  ? [styles.controllItemBtnText, { color: Colors.primary }]
                  : styles.controllItemBtnText
              }
            >
              Đèn: {ledPVS ? "Bật" : "Tắt"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* item */}
    </ClientLayout>
  )
}

const styles = StyleSheet.create({
  controllImage: {
    width: "100%",
    height: 170,
  },

  controllItem: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },

  controllItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 20,
  },

  controllItemBtnIcon: {
    fontSize: 50,
    color: Colors.white,
  },

  controllItemBtnText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.white,
  },
})

export default Controll
