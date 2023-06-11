#include <Servo.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <ArduinoJson.h>

Servo servo;  // tạo servo để điều khiển

// name, pass wifi kết nối thiết bị
String ssid = "Toan020101";
String pass = "toando2001";

// firebase config
#define FIREBASEHOST "esp8266-c2067-default-rtdb.firebaseio.com"
#define FIREBASEAUTH "mXcG93Q9Irvzz8udu044txQ7TeMFYiLf8dJIlCq4"
FirebaseData firebaseData;
String path = "/";

#define LEDPKPIN D0 // khai báo chân led
#define LEDPNPIN D1 // khai báo chân led
#define LEDPVSPIN D2 // khai báo chân led
#define SERVOPIN D3 // khai báo chân servo

#define BTNPKPIN D4 // khai báo chân button
#define BTNPNPIN D5 // khai báo chân button
#define BTNPVSPIN D6 // khai báo chân button
#define BTNSERVOPIN D7 // khai báo chân button

// trạng thái của thiết bị
bool ledPKSTT = false;
bool doorPKSTT = false;
bool ledPNSTT = false;
bool ledPVSSTT = false;

void setup() {
  // put your setup code here, to run once:
  // giao tiếp seral
  Serial.begin(9600);

  // kết nối chân cho servo
  servo.attach(SERVOPIN);
  pinMode(LEDPKPIN,OUTPUT); // khai báo tin hiệu ra cho led
  pinMode(LEDPNPIN,OUTPUT); // khai báo tin hiệu ra cho led
  pinMode(LEDPVSPIN,OUTPUT); // khai báo tin hiệu ra cho led

  pinMode(BTNPKPIN,INPUT_PULLUP); // khai báo tin hiệu vào cho button
  pinMode(BTNPNPIN,INPUT_PULLUP); // khai báo tin hiệu vào cho button
  pinMode(BTNPVSPIN,INPUT_PULLUP); // khai báo tin hiệu vào cho button
  pinMode(BTNSERVOPIN,INPUT_PULLUP); // khai báo tin hiệu vào cho button

  // kết nối wifi
  WiFi.begin(ssid, pass);

  // kiểm tra kết nối wifi
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Đang kết nối WiFi...");
  }

  String wifiIP = WiFi.localIP().toString();
  Serial.println("WiFi đã kết nối");
  Serial.println("Địa chỉ IP: " + wifiIP);

  // kết nối firebase
  bool FB_CONNECTED = false;
  do{
    Serial.println("Đang kết nối tới Firebase...");
    
    Firebase.begin(FIREBASEHOST, FIREBASEAUTH);
    Firebase.reconnectWiFi(true);
    if(!Firebase.beginStream(firebaseData, path)){
      Serial.println("REASON: " + firebaseData.errorReason());
      FB_CONNECTED = false;
    }else{
      Serial.println("Firebase đã kết nối");
      FB_CONNECTED = true;
    }
  }while(!FB_CONNECTED);

  // cấu hình dữ liệu mặc định cho firebase
  IPAddress baseIP = WiFi.localIP();
  path = path + "/esp8266_" + baseIP[0] + "_" + baseIP[1] + "_" + baseIP[2] + "_" + baseIP[3];
  Firebase.setString(firebaseData, path + "/ip", wifiIP);
  Firebase.setBool(firebaseData, path +  "/ledPK", ledPKSTT);
  Firebase.setBool(firebaseData, path +  "/doorPK", doorPKSTT);
  Firebase.setBool(firebaseData, path +  "/ledPN", ledPNSTT);
  Firebase.setBool(firebaseData, path +  "/ledPVS", ledPVSSTT);
}

void loop() {
  // Lấy nhiều giá trị từ Firebase Realtime Database  
  if (Firebase.get(firebaseData, path)) {
    DynamicJsonDocument jsonDocument(1024);
    
    deserializeJson(jsonDocument, firebaseData.payload());
    ledPKSTT = jsonDocument["ledPK"].as<bool>();
    doorPKSTT = jsonDocument["doorPK"].as<bool>();
    ledPNSTT = jsonDocument["ledPN"].as<bool>();
    ledPVSSTT = jsonDocument["ledPVS"].as<bool>();
  } else {
    Serial.println(firebaseData.errorReason());
  }
  
  // đọc giá trị từ button
  int valBTNPK = digitalRead(BTNPKPIN);
  // kiểm tra giá trị button
  if(valBTNPK == 0){
    ledPKSTT = !ledPKSTT;
    Firebase.setBool(firebaseData, path + "/ledPK", ledPKSTT);
  }
  
  int valBTNPN = digitalRead(BTNPNPIN);
  if(valBTNPN == 0){
    ledPNSTT = !ledPNSTT;
    Firebase.setBool(firebaseData, path + "/ledPN", ledPNSTT);
  }
  
  int valBTNPVS = digitalRead(BTNPVSPIN);
  if(valBTNPVS == 0){
    ledPVSSTT = !ledPVSSTT;
    Firebase.setBool(firebaseData, path + "/ledPVS", ledPVSSTT);
  }
  
  int valBTNSERVO = digitalRead(BTNSERVOPIN);
  if(valBTNSERVO == 0){
    doorPKSTT = !doorPKSTT;
    Firebase.setBool(firebaseData, path + "/doorPK", doorPKSTT);
  }
  
  // put your main code here, to run repeatedly:
  // kiểm tra trạng thái đèn phòng khách
  if(ledPKSTT){
    digitalWrite(LEDPKPIN, HIGH); // bật   
  }else {
    digitalWrite(LEDPKPIN, LOW);  // tắt
  }

  // kiểm tra trạng thái cửa ra vào
  if(doorPKSTT){
    servo.write(0); // mở cửa
  }else {
    servo.write(180); // đóng cửa
  }

  // kiểm tra trạng thái đèn phòng ngủ
  if(ledPNSTT){
    digitalWrite(LEDPNPIN, LOW); // bật
  }else {
    digitalWrite(LEDPNPIN, HIGH); // tắt
  }

  // kiểm tra trạng thái đèn phòng vệ sinh
  if(ledPVSSTT){
    digitalWrite(LEDPVSPIN, LOW); // bật
  }else {
    digitalWrite(LEDPVSPIN, HIGH); // tắt
  }
}
