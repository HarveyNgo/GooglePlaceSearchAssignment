import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { PlaceResult } from '../../types/google';
import { Colors } from '../../constants/colors';

interface Props {
  history: PlaceResult[];
  onSelect: (place: PlaceResult) => void;
}
const HistoryList: React.FC<Props> = ({ history = [], onSelect }) => {
  const renderItem = ({ item }: { item: PlaceResult }) => (
    <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
      <View>
        <Text style={styles.name}>{item.displayName.text}</Text>
        <Text style={styles.address}>{item.formattedAddress}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderColor: Colors.border },
  name: { fontWeight: '600' },
  address: { fontSize: 12, color: Colors.gray },
});

export { HistoryList };
