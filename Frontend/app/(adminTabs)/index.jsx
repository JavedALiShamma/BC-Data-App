import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { APIURl } from '../../constants/Api';
import useAuthStore from '../../store/UserAuth';

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [paidUsers, setPaidUsers] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();
  const setAllUsers =useAuthStore((state)=> state.setAllUsers);
  const router =useRoute();

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const fetchUsers = async () => {
    try {
      if(!token || !user) {
        console.log('No token or user found');  
        navigation.replace('(auth)'); // Redirect to login if no token or user
      }
      setRefreshing(true);
      const res = await axios.get(`${APIURl}/getUsersByAdmin/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const allUser = res.data.users;
      setUsers(allUser);
      setAllUsers(allUser);
      let paidUserCount = 0;
      let total = 0;

      allUser.forEach((user) => {
        const payment = user.payments.find(
          (p) =>
            p.month === currentMonth &&
            p.year === currentYear &&
            p.status === 'Paid'
        );
        if (payment) {
          paidUserCount += 1;
          total += payment.amount || 0;
        }
      });

      setPaidUsers(paidUserCount);
      setTotalCollected(total);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleSingleUser = (item) => {
    navigation.navigate('SingleUser', { user: item });
  };

  const renderBadge = (item) => {
    const payment = item.payments.find(
      (p) =>
        p.month === currentMonth &&
        p.year === currentYear &&
        p.status === 'Paid'
    );
    if (payment) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: 'green' }]}>
          <Text style={styles.statusText}>भुगतान हो गया</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.statusBadge, { backgroundColor: 'red' }]}>
          <Text style={styles.statusText}>भुगतान बाकी</Text>
        </View>
      );
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleSingleUser(item)} style={styles.userCard}>
      <Text style={styles.userName}>{item?.name}</Text>

      <View style={{ width: '40%', flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>
          पिता : {item.fatherName}
        </Text>
        <Text style={{ fontSize: 12 }}>{item.mobile}</Text>
      </View>

      {renderBadge(item)}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
      }
    >
      <Text style={styles.title}>Hello, {user?.name}</Text>

      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Users</Text>
          <Text style={styles.cardValue}>{users.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Users Paid</Text>
          <Text style={styles.cardValue}>{paidUsers}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Collected (₹)</Text>
          <Text style={styles.cardValue}>{totalCollected}</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>User List</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        scrollEnabled={false}
      />

      <View style={{ width: '100%', height: 50 }} />
    </ScrollView>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
