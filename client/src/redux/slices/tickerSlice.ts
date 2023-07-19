import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITicker {
    ticker: string;
    exchange: string;
    price: number;
    change: number;
    change_percent: number;
    dividend: number;
    yield: number;
    last_trade_time: string;
}

interface ITickersState {
    tickers: ITicker[];
    filteredTickers: ITicker[];
    uncheckedTickers: string[];
}

const initialState: ITickersState = {
    tickers: [],
    filteredTickers: [],
    uncheckedTickers: [],
};

const tickerSlice = createSlice({
    name: "ticker",
    initialState,
    reducers: {
        getTickers: (state, action: PayloadAction<ITicker[]>) => {
            state.tickers = action.payload;
            state.filteredTickers = state.tickers.filter(
                (ticker) => state.uncheckedTickers.indexOf(ticker.ticker) === -1
            );
        },
        updateFilter: (state, action: PayloadAction<string[]>) => {
            state.uncheckedTickers = [...action.payload];
            state.filteredTickers = state.tickers.filter(
                (ticker) => state.uncheckedTickers.indexOf(ticker.ticker) === -1
            );
        },
    },
});

export const { getTickers, updateFilter } = tickerSlice.actions;

export const tickersReducer = tickerSlice.reducer;
