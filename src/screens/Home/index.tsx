import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { PlaceSearch, PlaceBottomSheet } from '../../components';
import { PlaceResult } from '../../types/google';
import { Colors } from '../../constants/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { saveHistory } from '../../redux/slices/googleSlice';
import { useAppSelector } from '../../redux/hook/useAppSelector';

const HomeScreen = () => {
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [history, setHistory] = useState<PlaceResult[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const dispatch = useDispatch();
  const historyState = useAppSelector(state => state.google.history);
  useEffect(() => {
    (async () => {
      setHistory(historyState);
    })();
  }, [historyState]);

  const onPlaceSelected = async (place: PlaceResult) => {
    setSelectedPlace(place);

    const newHistory = [place, ...history.filter(h => h.id !== place.id)].slice(
      0,
      50,
    );
    setHistory(newHistory);
    dispatch(saveHistory(newHistory));

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

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.searchContainer}>
        <PlaceSearch onPlaceSelected={onPlaceSelected} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 3.140853,
          longitude: 101.693207,
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

      <PlaceBottomSheet
        history={history}
        selectedPlace={selectedPlace}
        onPlaceSelected={onPlaceSelected}
      />
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
    backgroundColor: Colors.white,
    maxHeight: '35%',
    padding: 10,
  },
  historyTitle: { fontWeight: '600', marginBottom: 6 },
  bottomSheetContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
