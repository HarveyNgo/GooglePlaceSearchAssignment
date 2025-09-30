import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { PlacePhoto, PlaceResult } from '../../types/google';
import { buildPhotoUrl } from '../../utils/google';
import { Colors } from '../../constants/colors';

interface Props {
  history: PlaceResult[];
  selectedPlace?: PlaceResult | null;
  onPlaceSelected: (place: PlaceResult) => void;
}

const PlaceBottomSheet: React.FC<Props> = ({
  history,
  selectedPlace,
  onPlaceSelected,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '30%', '30%'], []);
  const [selected, setSelected] = useState<PlaceResult | null>(
    selectedPlace || null,
  );

  const handleSelect = useCallback(
    (item: PlaceResult) => {
      setSelected(item);
      onPlaceSelected(item);
      bottomSheetRef.current?.expand();
    },
    [onPlaceSelected],
  );

  const handleCloseDetail = useCallback(() => {
    setSelected(null);
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  useEffect(() => {
    if (selectedPlace) {
      setSelected(selectedPlace);
    }
  }, [selectedPlace]);

  const renderItem = ({ item }: { item: PlaceResult }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      style={styles.historyItem}
    >
      <Text style={styles.historyName}>{item.displayName.text}</Text>
      <Text style={styles.historyAddress}>{item.formattedAddress}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
      {!selected && (
        <BottomSheetView style={styles.bottomSheetHistoryContainer}>
          <Text style={styles.placeHistory}>Place History</Text>
          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </BottomSheetView>
      )}

      {selected && (
        <BottomSheetView style={styles.bottomSheetContainer}>
          <TouchableOpacity
            onPress={handleCloseDetail}
            style={styles.closeButton}
          >
            <Text>X</Text>
          </TouchableOpacity>

          <Text style={styles.name}>{selected.displayName.text}</Text>
          <Text style={styles.address}>{selected.formattedAddress}</Text>

          <View style={styles.content}>
            <Text>🗺 Latitude: {selected.location.latitude}</Text>
            <Text>🗺 Longitude: {selected.location.longitude}</Text>
            <Text>🌍 Timezone: {selected.timeZone?.id}</Text>
            <BottomSheetFlatList
              data={selected.photos}
              horizontal
              keyExtractor={(item: PlacePhoto) => item.name}
              renderItem={({ item }: { item: PlacePhoto }) => {
                const uri = buildPhotoUrl(item.name);
                return (
                  <Image
                    source={{ uri }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                );
              }}
              showsHorizontalScrollIndicator={true}
            />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
};

export { PlaceBottomSheet };

const styles = StyleSheet.create({
  container: {},
  bottomSheetHistoryContainer: { flex: 1, padding: 16 },
  placeHistory: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  historyName: { fontSize: 16, fontWeight: '600' },
  historyAddress: { fontSize: 14, color: Colors.gray },
  bottomSheetContainer: { flex: 1, padding: 10 },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  name: { fontSize: 20, fontWeight: '700' },
  address: { fontSize: 16, color: Colors.gray, marginTop: 4 },
  photo: {
    width: 100,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: Colors.border,
  },
  content: { marginTop: 12, marginBottom: 20 },
});
