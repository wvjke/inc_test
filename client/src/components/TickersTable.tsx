import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { ITicker, getTickers } from "../redux/slices/tickerSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import Ticker from "./Ticker/Ticker";
import "./tickersTable.scss";

const TickersTable = () => {
    const dispatch: AppDispatch = useDispatch();
    const tickers: ITicker[] = useSelector(
        (state: RootState) => state.tickers.filteredTickers
    );

    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000");

        socket.emit("start");

        socket.on("ticker", (response: ITicker[]) => {
            const res = Array.isArray(response) ? response : [response];
            dispatch(getTickers(res));
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <TableContainer className="table_container">
            <Table
                sx={{
                    fontFamily: "Open Sans, sans-serif",
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "250px" }}>Ticker</TableCell>
                        <TableCell sx={{ width: "250px" }}>Price</TableCell>
                        <TableCell sx={{ width: "250px" }}>Change</TableCell>
                        <TableCell sx={{ width: "250px" }}>
                            Change Percent
                        </TableCell>
                        <TableCell sx={{ width: "200px" }} align="center">
                            Add to watch list
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tickers.map((ticker) => (
                        <TableRow key={ticker.ticker}>
                            <Ticker ticker={ticker} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TickersTable;
