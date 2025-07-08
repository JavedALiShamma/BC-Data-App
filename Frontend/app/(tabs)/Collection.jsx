import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import useAuthStore from '../../store/UserAuth';
import { APIURl } from '../../constants/Api';
import Loader from '../../components/Loader';
const LoanerScreen = () => {
  const { token } = useAuthStore();
  const [loaners, setLoaners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(months[currentDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const ApiCall = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${APIURl}/getLoaners`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          let validLoaners = response.data.users.filter((loaner)=>loaner.outstandingBalance > 0);
         // Here we will remove the loaners details which are not valid

          setLoaners(validLoaners|| []);
        } else {
          Alert.alert('Error', 'Failed to fetch data');
        }
      } catch (err) {
        Alert.alert('Unsuccessful', 'Server Error');
      }
      setIsLoading(false);
    };
    ApiCall();
  }, []);

  const filteredLoaners = loaners.map(loaner => {
    let paidEntry = null;
    if (Array.isArray(loaner.installmentsPaid)) {
      paidEntry = loaner.installmentsPaid.find(
        inst =>
          inst?.month === selectedMonth && inst?.year === selectedYear
      );
    }
    return {
      ...loaner,
      hasPaid: !!paidEntry,
      paidDate: paidEntry?.date || null,
    };
  });

  const paidCount = filteredLoaners.filter(l => l.hasPaid).length;
  const unpaidCount = filteredLoaners.filter(l => !l.hasPaid).length;

  const renderItem = ({ item }) => (
    
    <TouchableOpacity style={styles.card} onPress={() => Alert.alert('Loaner', item.name)}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: item.hasPaid ? 'green' : 'red' },
          ]}
        >
          <Text style={styles.badgeText}>{item.hasPaid ? 'Paid' : 'Unpaid'}</Text>
        </View>
      </View>
      <Text style={{color:"red", textAlign:"center"}}> लोन लिया गया : {item.startMonth} || {item.startYear}</Text>
      <Text>लोन राशि: ₹{item.amount}</Text>
      <Text>किस्त: ₹{item.installmentAmount}</Text>
      <Text>किस्त बाकी है: {item.installmentLeft}</Text>
      <Text style={{textAlign:"center" , color:"green"}}>बकाया राशि: ₹{item.outstandingBalance}</Text>
      {item.installmentsPaid[0] && (
        <Text>Paid On: {item.installmentsPaid[0].paidOn} </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Month & Year Pickers */}
      <View style={styles.pickerRow}>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={setSelectedMonth}
        >
          {months.map(month => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={setSelectedYear}
        >
          {Array.from({ length: 9 }, (_, i) => 2025 + i).map(year => (
            <Picker.Item key={year} label={`${year}`} value={year} />
          ))}
        </Picker>
      </View>

      {/* Count Row */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>🟢 Paid: {paidCount}</Text>
        <Text style={styles.countText}>🔴 Unpaid: {unpaidCount}</Text>
        <Text style={styles.countText}>📊 Total: {filteredLoaners.length}</Text>
      </View>

      {/* Loader or List */}
      {isLoading ? (
        <Loader/>
      ) : (
        <FlatList
          data={filteredLoaners}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No Loaners</Text>}
        />
      )}
    </View>
  );
};

export default LoanerScreen;

const styles = StyleSheet.create({
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  countText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
