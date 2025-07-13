import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create((set) => ({
      user: null,
      token: null,
      allUsers:null,
      monthlyFees:null,
      startsFrom:null,

      login: async(userData, token) => {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('token', token);
        set({ user: userData, token: token });

      },
      checkAuth : async () =>{
        try{
          const token = await AsyncStorage.getItem('token');
          const userJson = await AsyncStorage.getItem('user');
          const user = userJson ? JSON.parse(userJson) : null;
          set({ user: user, token: token });
        }
        catch(err){
          console.error("Error checking auth:", err);
        }
      },
     logout: async() => {
      // await AsyncStorage.removeItem('auth-storage'); 
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      set(() => ({
        user: null,
        token: null,
        allUsers: null,
        monthlyFees:null,
        startsFrom:null,
      }));

    },
      setAllUsers:(users)=>{
        set({allUsers:users});
      },
      setStore :(monthlyFees , startsFrom)=>{
          set({monthlyFees:monthlyFees , startsFrom:startsFrom})
      }
    }),
   
  
);

export default useAuthStore;