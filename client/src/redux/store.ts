import { configureStore } from "@reduxjs/toolkit";
import { tickersReducer } from "./slices/tickerSlice";
const store = configureStore({
    reducer: {
        tickers: tickersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
