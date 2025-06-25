import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (userData, token) => {
        set({ user: userData, token: token });
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // Key in AsyncStorage
      getStorage: () => AsyncStorage,
    }
  )
);

export default useAuthStore;
