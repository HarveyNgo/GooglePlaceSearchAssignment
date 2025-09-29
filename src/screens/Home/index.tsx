import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { PlaceSearch, HistoryList } from '../../components';
import { saveHistory, loadHistory } from '../../utils/storage';
import { PlaceResult } from '../../types/google';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [history, setHistory] = useState<PlaceResult[]>([]);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      const h = await loadHistory();
      setHistory(h);
    })();
  }, []);

  const onPlaceSelected = async (place: PlaceResult) => {
    setSelectedPlace(place);

    const newHistory = [place, ...history.filter(h => h.id !== place.id)].slice(
      0,
      50,
    );
    setHistory(newHistory);
    await saveHistory(newHistory);

    if (mapRef.current && place.location) {
      const region: Region = {
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region, 500);
    }
  };

  const onHistorySelect = (place: PlaceResult) => {
    onPlaceSelected(place);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.searchContainer}>
        <PlaceSearch onPlaceSelected={onPlaceSelected} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 21.0278,
          longitude: 105.8342,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {selectedPlace && selectedPlace.location && (
          <Marker
            coordinate={{
              latitude: selectedPlace.location.latitude,
              longitude: selectedPlace.location.longitude,
            }}
            title={selectedPlace.displayName.text}
            description={selectedPlace.formattedAddress}
          />
        )}
      </MapView>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Search History</Text>
        <HistoryList history={history} onSelect={onHistorySelect} />
      </View>
    </SafeAreaProvider>
  );
};

export { HomeScreen };

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  map: { flex: 1 },
  historyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    maxHeight: '35%',
    padding: 10,
  },
  historyTitle: { fontWeight: '600', marginBottom: 6 },
});
