import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";

export default function TabTwoScreen() {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<any>(null);
  // const [status, requestPermission] = Location.useBackgroundPermissions();
  useEffect(() => {
    Location.getCurrentPositionAsync({}).then((location) => {
      console.log("location", location);
      setLocation(location);
    });
  }, []);

  if (!status || !status.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You don't have enabled location permission please enable</Text>
        <Button title="Grant location access" onPress={requestPermission} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            image={{ uri: "https://tmpfiles.nohat.cc/full-m2H7K9i8Z5K9Z5d3.png" }}
            title={"Me"}
            description={"My position"}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
