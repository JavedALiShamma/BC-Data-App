import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      allUsers:null,
      monthlyFees:null,
      startsFrom:null,

      login: (userData, token) => {
        set({ user: userData, token: token });
      },

     logout: () => {
      // await AsyncStorage.removeItem('auth-storage'); 
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
    {
      name: 'auth-storage', // Key in AsyncStorage
      // getStorage: () => AsyncStorage,
      storage: AsyncStorage,
    }
  )
);

export default useAuthStore;