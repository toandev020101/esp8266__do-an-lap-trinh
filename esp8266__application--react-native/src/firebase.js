import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyDLaWLv5KUC3IGQAdhpBW6b9Cx_6asaL7w",
  authDomain: "esp8266-c2067.firebaseapp.com",
  databaseURL: "https://esp8266-c2067-default-rtdb.firebaseio.com",
  projectId: "esp8266-c2067",
  storageBucket: "esp8266-c2067.appspot.com",
  messagingSenderId: "701850965465",
  appId: "1:701850965465:web:fe60919dd3df10723775c8",
  measurementId: "G-Z0Y6VQTWJE",
}

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig)

// Lấy đối tượng Database của Firebase
const database = getDatabase(app)

export default database
