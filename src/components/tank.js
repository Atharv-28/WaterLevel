import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import {firebaseApp} from "../../database/firebaseConfig";

const Tank = () => {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Get a reference to the database service
    const db = getDatabase(firebaseApp);

    // Create a reference to the database location where the distance is stored
    const distanceRef = ref(db, "tank/dist");

    const Total = 180;
    const Ratio = 11.11;

    // Fetch the distance from the database
    get(distanceRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Distance exists in the database
          setDistance(snapshot.val());
        } else {
          // Distance does not exist in the database
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Distance: {distance}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Tank;
