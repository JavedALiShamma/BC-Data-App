import { useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const UserManagementScreen = () => {
    const naviagtion =useNavigation();
  const [users, setUsers] = useState([
    { id: '1', name: 'Shaoib Sisodia', address: 'Sarodiya Basti', amount: 200, paid: true },
    { id: '2', name: 'Javed Ali', address: 'Lalgarh , Bikaner', amount: 0, paid: false },
    { id: '3', name: 'Ayal Sameja', address: 'Indra Colony', amount: 200, paid: true },
    // Add more dummy or backend-loaded data
  ]);
  const handleAddUser=()=>{
    naviagtion.navigate("UserEntry");
  }
  const totalCollected = users.reduce((sum, user) => sum + (user.paid ? user.amount : 0), 0);

  const renderUserItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={[styles.badge, item.paid ? styles.paidBadge : styles.unpaidBadge]}>
        <Text style={styles.badgeText}>
          {item.paid ? 'Paid' : 'Unpaid'}
        </Text>
      </View>
    </View>
    <Text style={styles.address}>{item.address}</Text>
    <Text style={styles.amount}>₹ {item.amount}</Text>
  </View>
);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.totalAmount}>Total Collected: ₹ {totalCollected}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Text style={styles.addText}>+ नया यूजर जोड़ें</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
  },
  topBar: {
    marginTop: 10,
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    color: '#000',
  },
  badge: {
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 999,
  alignItems: 'center',
  justifyContent: 'center',
},
paidBadge: {
  backgroundColor: 'green',
},
unpaidBadge: {
  backgroundColor: 'red',
},
badgeText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 12,
},
});
