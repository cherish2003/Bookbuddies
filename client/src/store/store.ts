import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "@/store/slices/bookSlice";
import authReducer from "@/store/slices/authSlice";
import requestReducer from "@/store/slices/requestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    requests: requestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
