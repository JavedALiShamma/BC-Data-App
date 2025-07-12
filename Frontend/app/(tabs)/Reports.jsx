import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { APIURl } from '../../constants/Api'
import useAuthStore from '../../store/UserAuth'

const Reports = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loaners, setLoaners] = useState([]);
 const [isLoading, setIsLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(months[currentDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const token =useAuthStore((state) => state.token);
  useEffect(() => {
    const getAllData = async () => {
      try {
        const getAllUsers = await axios.get(`${APIURl}/getAllUsers`);
        if (getAllUsers.status == 200) {
          setAllUsers(getAllUsers.data.users);
        }
      } catch (err) {
        Alert.alert("Error in fetching");
      }
    };
    getAllData();
  }, []);
useEffect(()=>{
  const getLoans =async()=>{
      try{
        const loaners=await axios.get(`${APIURl}/getLoaners`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        if(loaners.status==200){
       
          setLoaners(loaners.data.users);
          // setAllUsers(loaners.data.loaners);
        }
      }
      catch(err){
        console.log("Error in fetching loaners", err);
        Alert.alert("Error in fetching loaners");
      }
  }
  getLoans();
},[])
  const getMonthPayment = (user) => {
    const match = user.payments.find(
      (p) => p.month === selectedMonth && p.year === selectedYear
    );
    return match || { status: 'Unpaid', amount: 0 };
  };

  // 🧮 Total collection for June 2025
  const totalCollection = allUsers.reduce((sum, user) => {
    const payment = getMonthPayment(user);
    return sum + (payment.amount || 0);
  }, 0);
  const totalLoanGiven = loaners.reduce((sum, loan) => {
    if (loan.startMonth === selectedMonth && loan.startYear === selectedYear) { 
      return sum + (loan.amount || 0);
    }
    return sum;
  }, 0);
  const totalInstallmentsPaid = loaners.reduce((sum, loan) => {
    const monthInstallment = loan.installmentsPaid.find(  
      installment => installment.month === selectedMonth && installment.year === selectedYear
    );
    if (monthInstallment) {
      return sum + (monthInstallment.amount || 0);
    } 
    return sum;
  }, 0);

  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor:"white", padding: 2}}>
      <ScrollView style={{flex: 1 ,marginBottom: 50}}>
      <Text style={{textAlign:"center", fontSize:18 , fontWeight:700 , color:"blue"}}> रिपोर्ट के लिए माह और वर्ष चुनें</Text>
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
      {/* Total Collection Display */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          कुल जामा राशि {selectedMonth} {selectedYear}: ₹{totalCollection}
        </Text>
      </View>

      {/* Table */}
      <ScrollView horizontal>
        <View style={styles.container}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>नाम</Text>
            <Text style={styles.headerCell}>मोबाइल नंबर</Text>
            <Text style={styles.headerCell}>पिता का नाम</Text>
            <Text style={styles.headerCell}>{selectedMonth}स्थिति</Text>
            <Text style={styles.headerCell}>{selectedMonth} राशि</Text>
          </View>

          {/* Table Rows */}
          {allUsers.map((user, index) => {
            const monthPayment = getMonthPayment(user);

            return (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{user.name}</Text>
                <Text style={styles.cell}>{user.mobile}</Text>
                <Text style={styles.cell}>{user.fatherName}</Text>
                <Text style={styles.cell}>{monthPayment.status}</Text>
                <Text style={styles.cell}>₹{monthPayment.amount}</Text>
              </View>
            );
          })}
        
        </View>
         
      </ScrollView>
      <View style={styles.totalBox}>
       <Text style={styles.totalText}>
          कुल लोन दिया {selectedMonth} {selectedYear}: {totalLoanGiven}
        </Text>
        </View>
       <ScrollView horizontal> 
       
         <View style={styles.container}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>नाम</Text>
            <Text style={styles.headerCell}>लोन देने का महीना</Text>
            <Text style={styles.headerCell}>लोन देने का महीना वर्ष</Text>
            <Text style={styles.headerCell}>गवाह 1</Text>
            <Text style={styles.headerCell}>गवाह 2</Text>
        
            <Text style={styles.headerCell}> Loan राशि</Text>
          </View>

          {/* Table Rows */}
      
          {loaners.filter(loan => loan.startMonth === selectedMonth && loan.startYear === selectedYear).map((loan, index) => (
            <View key={index} style={styles.row}>
            <Text style={styles.cell}>{loan.name}</Text>
            <Text style={styles.cell}>{loan.startMonth}</Text>
            <Text style={styles.cell}>{loan.startYear}</Text> 
            <Text style={styles.cell}>{loan.witness1}</Text>
            <Text style={styles.cell}>{loan.witness2}</Text>
            <Text style={styles.cell}>₹{loan.amount}</Text>
            </View>
          ))}
        
        </View>
       </ScrollView>
         <View style={styles.totalBox}>
       <Text style={styles.totalText}>
          कुल लोन की किश्त मिली {selectedMonth} {selectedYear}: {totalInstallmentsPaid}
        </Text>
        </View>
        <ScrollView horizontal>
        <View style={styles.container}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>नाम</Text>
       
      
            <Text style={styles.headerCell}>{selectedMonth} स्थिति</Text>
            <Text style={styles.headerCell}>{selectedMonth} राशि</Text>
          </View>

          {/* Table Rows */}
          {loaners.filter(loan =>loan.installmentsPaid && loan.installmentsPaid.some(installment => installment.month === selectedMonth && installment.year === selectedYear)).map((loan, index) => {
            const monthInstallment = loan.installmentsPaid.find(  
              installment => installment.month === selectedMonth && installment.year === selectedYear
            ) || { status: 'Unpaid', amount: 0 };
            return (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{loan.name}</Text>
          
         
                <Text style={styles.cell}>{monthInstallment.status}</Text>
                <Text style={styles.cell}>₹{monthInstallment.amount}</Text>
              </View>
            );
          })}
         </View>
        </ScrollView>
      </ScrollView>
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  totalBox: {
    backgroundColor: '#e6ffe6',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#006600',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor:"white"
  },
  headerRow: {
    backgroundColor: '#cce6ff',
    borderTopWidth: 1,
  },
  headerCell: {
    width: 120,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cell: {
    width: 120,
    textAlign: 'center',
    fontSize: 13,
    
  },
   pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor:"white",
     borderColor:"black",
    borderWidth:1
   
  },
  picker: {
    flex: 1,
    height: 55,
   
  }
});

export default Reports;
