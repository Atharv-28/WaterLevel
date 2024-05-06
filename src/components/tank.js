import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebaseApp } from "../../database/firebaseConfig";

const Tank = () => {
  const [distance, setDistance] = useState(null);
  const [timeDate, setTimeDate] = useState(null);
  const [fillTank, setFillTank] = useState(null);
  const [water, setWater] = useState(null);
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    // Get a reference to the database service
    const db = getDatabase(firebaseApp);
  
    // Create a reference to the database location where the distance and timeDate are stored
    const distanceRef = ref(db, "tank/dist");
    const timeDateRef = ref(db, "tank/timeDate");
  
    // Set up a real-time listener for the distance data
    onValue(distanceRef, (snapshot) => {
      if (snapshot.exists()) {
        // Distance exists in the database
        const distanceValue = snapshot.val();
        setDistance(distanceValue);
  
        // Calculate fill percentage
        const Total = 165;
        const min = 10;
        const calculatedFillTank = Total - distanceValue - min;
        const calculatedFillPercentage = (calculatedFillTank / (Total - min)) * 100;
  
        // Calculate water
        const Ratio = 12.9;
        const calculatedWater = calculatedFillTank * Ratio;
  
        // Update state with calculated values
        setFillTank(calculatedFillTank);
        setWater(calculatedWater);
        setFillPercentage(calculatedFillPercentage);
      } else {
        // Distance does not exist in the database
        console.log("No data available");
      }
    });
  
    // Set up a real-time listener for the timeDate data
    onValue(timeDateRef, (snapshot) => {
      if (snapshot.exists()) {
        // timeDate exists in the database
        const timeDateValue = snapshot.val();
        setTimeDate(timeDateValue);
      } else {
        // timeDate does not exist in the database
        console.log("No timeDate available");
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tank}>
          <View style={[styles.water, { height: `${fillPercentage}%` }]}>
            <Text style={styles.waterText}>{water} ltrs.</Text>
          </View>
        </View>
        <Text style={styles.text}>Fill Tank: {fillPercentage} %</Text>
        <Text style={styles.text}>Water : {water} Ltrs.</Text>
        <Text style={styles.text}>Time : {timeDate}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  content: {
    alignItems: "center",
  },
  tank: {
    width: 150,
    height: 300,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 10,
    overflow: "hidden",
  },
  water: {
    position: "absolute",
    justifyContent: "center",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#84adea",
  },
  waterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Tank;
