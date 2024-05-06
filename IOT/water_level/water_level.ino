
#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <TimeLib.h> // Include Time library for time functions
#include <time.h>


//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "GAJLAXMI"
#define WIFI_PASSWORD "27152813"

// Insert Firebase project API Key
#define API_KEY "AIzaSyDWCu-Q7mGU1_EBe7cBB_yb0508f5bEHhY"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://waterlevel-d67a3-default-rtdb.asia-southeast1.firebasedatabase.app/" 


#define SOUND_SPEED 0.034

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

// Pins for Ultrasonic sensor
#define TRIGGER_PIN 14
#define ECHO_PIN 27

// Variable to hold the distance value
float distance = 0.0;
long duration;

char dateTime[50]; // Make sure it's large enough to hold the formatted date and time


void printLocalTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }

  // Format the date and time
  strftime(dateTime, sizeof(dateTime), "%d-%m-%Y %H:%M:%S", &timeinfo);
}


void setup(){
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);

  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Measure distance
  // Clears the trigPin
  digitalWrite(TRIGGER_PIN, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER_PIN, LOW);
  
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(ECHO_PIN, HIGH);
  
  // Calculate the distance
  distance = duration * SOUND_SPEED /2;
  Serial.println(duration);

  // Initialize time
  configTime(0, 0, "pool.ntp.org"); // Set NTP server
  // Set time zone to IST (Indian Standard Time)
  const char *tz = "IST-5:30";
  setenv("TZ", tz, 1);
  tzset();

  // Wait for time to synchronize
  while (!time(nullptr)) {
    delay(1000);
    Serial.println("Waiting for time sync...");
  }

  // Print current time
  Serial.println("Time synchronized");
  printLocalTime();
  
  // Upload distance and dateTime to Firebase
  if (Firebase.RTDB.setFloat(&fbdo, "tank/dist", distance)) {
    Serial.println(dateTime);
    Firebase.RTDB.setString(&fbdo, "tank/timeDate", dateTime);
    digitalWrite(LED_BUILTIN, HIGH);  // turn the LED on (HIGH is the voltage level)
    delay(300);
    Serial.println(distance);
    digitalWrite(LED_BUILTIN, LOW); 
  } else {
    Serial.println("FAILED");
    Serial.println("REASON: " + fbdo.errorReason());
  }
  delay(5000);
}