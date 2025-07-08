import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AllAdminsDetails = () => {
  // const navigation = useNavigation();
  const navigation = useNavigation();
  const route = useRoute();
 const {user :users} =route.params;

  const handleCardPress = (user) => {
    // You can navigate or show more info here
    // navigation.navigate('UserDetail', { user });
    navigation.navigate('singleAdminDetails', {user});
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <Card style={styles.card} elevation={5}>
        <Card.Title
          title={item.name}
          subtitle={item.email}
          left={(props) => (
            <Avatar.Text
              {...props}
              label={item.name.charAt(0).toUpperCase()}
              style={{ backgroundColor: '#4e73df' }}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.info}><TextLabel>📍 Address:</TextLabel> {item.address}</Text>
          <Text style={styles.info}><TextLabel>📞 Mobile:</TextLabel> {item.mobile}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
     
    <View style={{width:"95%", margin:"auto", borderRadius:10,marginTop : 5,backgroundColor:"white" , padding:10}}>
    <Text style={{textAlign:"center" , fontSize:15 , fontWeight:700 ,color:"blue"}}>सभी मुखिया : {users.length}</Text>
     <Ionicons style={{position:"absolute", left:10 , top: 10}} onPress={()=>{navigation.goBack()}} name='arrow-back' size={20}/>
    </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserCard}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

const TextLabel = ({ children }) => (
  <Text style={{ fontWeight: 'bold', color: '#333' }}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  info: {
    marginTop: 5,
    fontSize: 14,
    color: '#444',
  },
});

export default AllAdminsDetails;
