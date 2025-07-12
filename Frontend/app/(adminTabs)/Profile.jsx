import { useNavigation } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useAuthStore from '../../store/UserAuth';

const AdminProfileScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
           
             await logout();
              navigation.replace('(auth)'); // Adjust route as needed
          },
        },
      ],
      { cancelable: true }
    );
  };
if (!user?._id) return;
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Profile</Text>

      {/* ✅ Conditional rendering to avoid null errors */}
      {user ? (
        <>
          <Text style={styles.info}>Welcome, {user?.name || 'Admin'}</Text>
          <Text style={styles.info}>ID: {user?._id}</Text>
        </>
      ) : (
        <Text style={styles.info}>Loading user data...</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  info: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 40,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});
