import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAuthStore from "../store/UserAuth"
import Ionicons from 'react-native-vector-icons/Ionicons'; 
const AllLoaners = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const route = useRoute();
  const { user = [] } = route.params || {};
  const navigation=useNavigation();
  const [loanUsers, setLoanUsers] = useState([]);

  const currentDate = new Date();
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
    const superAdmin = useAuthStore((state) => state.user)
    
  const handleLoan =(item)=>{
    navigation.navigate("LoanGiving",{user:item});
  }
  useEffect(() => {
    const filteredUsers = user.filter(u =>
      u.payments?.some(
        p =>
          p.isAppliedLoan === true &&
          p.month === currentMonth &&
          p.year === currentYear
      )
    );

    setLoanUsers(filteredUsers);
  }, [user]);

  const renderUserCard = ({ item }) => {
    const isCibilLow = item.cibilScore < 700;
    const hasActiveLoan = item.activeLoanId !== null;

    const CardWrapper = hasActiveLoan ? View : TouchableOpacity;

    return (
      <CardWrapper onPress={()=>handleLoan(item)} style={[
        styles.card,
        hasActiveLoan && styles.cardWithLoan,
      ]}>
        {/* CIBIL Badge */}
        <View style={[
          styles.cibilBadge,
          { backgroundColor: isCibilLow ? '#ff4d4d' : '#4da6ff' }
        ]}>
          <Text style={styles.cibilText}>CIBIL : {item.cibilScore}</Text>
        </View>

        {/* Loan Notice */}
        {hasActiveLoan && (
          <Text style={styles.loanBanner}>इस व्यक्ति के पास पहले से ही लोन है</Text>
        )}

        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>Father's Name: {item.fatherName}</Text>
        <Text style={styles.detail}>Mobile: {item.mobile}</Text>
        <Text style={styles.detail}>Address: {item.address}</Text>
      </CardWrapper>
    );
  };

  return (
    <View style={styles.container}>
      <Ionicons onPress={()=>navigation.goBack()} style={{position:"absolute", left:10 , top:17}} name='arrow-back' size={25}/>
      <Text style={styles.title}>जिन्होंने लोन के लिए आवेदन किया है - {currentMonth} {currentYear}</Text>
      <FlatList
        data={loanUsers}
        keyExtractor={item => item._id}
        renderItem={renderUserCard}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No applicants found for this month.</Text>
        }
        contentContainerStyle={loanUsers.length === 0 && { flex: 1, justifyContent: 'center' }}
      />
    </View>
  );
};

export default AllLoaners;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eef3f7',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
    
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    position: 'relative',
    borderLeftWidth: 6,
    borderLeftColor: '#4da6ff',
  },
  cardWithLoan: {
    borderLeftColor: '#ff4d4d',
    backgroundColor: '#fff7f7',
  },
  cibilBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4da6ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  cibilText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  loanBanner: {
    backgroundColor: '#ffcccc',
    padding: 6,
    borderRadius: 6,
    marginBottom: 8,
    marginTop:12,
    color: '#cc0000',
    textAlign: 'center',
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    marginTop: 2,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
});
