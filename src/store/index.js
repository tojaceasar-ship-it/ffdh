import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../services/charactersSlice';
import cartReducer from '../services/cartSlice';

const store = configureStore({
  reducer: {
    characters: charactersReducer,
    cart: cartReducer,
  },
});

export default store;
