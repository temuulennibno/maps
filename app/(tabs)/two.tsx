import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import axios from "axios";

export default function TabTwoScreen() {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    Location.getCurrentPositionAsync({}).then((location) => {
      console.log("location", location);
      setLocation(location);
      setMarker({ longitude: location.coords.longitude, latitude: location.coords.latitude });
    });
  }, []);

  useEffect(() => {
    if (marker) {
      (async () => {
        const options = {
          method: "GET",
          url: "https://opentripmap-places-v1.p.rapidapi.com/en/places/radius",
          params: {
            radius: "500",
            lon: marker.longitude,
            lat: marker.latitude,
            kinds: "interesting_places",
          },
          headers: {
            "X-RapidAPI-Key": "fda9945fc6msh3d38c07c56e6013p18429ajsn21c639670159",
            "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
          },
        };

        try {
          const response = await axios.request(options);
          setPlaces(response.data.features);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [marker]);

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
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}
          zoomEnabled
          onPress={(e) => {
            setMarker(e.nativeEvent.coordinate);
          }}
        >
          <Circle center={marker} radius={500} fillColor={"rgba(24, 110, 247,0.1)"} strokeColor="rgb(24, 110, 247)" />
          <Marker
            coordinate={marker}
            draggable
            image={require("../../assets/pin.png")}
            onDragEnd={(e) => {
              setMarker(e.nativeEvent.coordinate);
            }}
          />
          {places.map((place) => (
            <Marker
              key={place.properties.xid}
              coordinate={{
                latitude: place.geometry.coordinates[1],
                longitude: place.geometry.coordinates[0],
              }}
              title={place.properties.name}
            />
          ))}
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
