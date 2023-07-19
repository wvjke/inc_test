import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { ITicker } from "../../redux/slices/tickerSlice";
import { updateFilter } from "../../redux/slices/tickerSlice";
import { Box, Chip } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import "./controls.scss";
import "react-toastify/dist/ReactToastify.css";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const TableControls = () => {
    const dispatch: AppDispatch = useDispatch();
    const tickers: ITicker[] = useSelector(
        (state: RootState) => state.tickers.tickers
    );

    const [uncheckedTickers, setCheckedTickers] = useState<string[]>([]);

    const handleUnchekedTickerChange = (
        event: SelectChangeEvent<typeof uncheckedTickers>
    ) => {
        const {
            target: { value },
        } = event;
        setCheckedTickers(() => {
            const newUncheckedTickers =
                typeof value === "string" ? value.split(",") : value;
            dispatch(updateFilter(newUncheckedTickers));
            return newUncheckedTickers;
        });
    };

    const handleDelayChange = (event: SelectChangeEvent<number>) => {
        fetch("http://localhost:4000/fetchInterval", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                interval: +event.target.value * 1000,
            }),
        })
            .then(() =>
                toast.info(
                    `Interval changed to ${event.target.value} ${
                        +event.target.value === 1 ? "second" : "seconds"
                    } `
                )
            )
            .catch((e) => console.error(e));
    };

    return (
        <div className="table_controls">
            <FormControl sx={{ width: 250 }}>
                <InputLabel id="tickersFilter">Hidden tickers</InputLabel>
                <Select
                    labelId="tickersFilter"
                    id="tickersFilter"
                    multiple
                    value={uncheckedTickers}
                    onChange={handleUnchekedTickerChange}
                    input={<OutlinedInput label="hidd_tickrs" />}
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                width: 250,
                            },
                        },
                    }}
                >
                    {tickers.map((ticker: ITicker) => (
                        <MenuItem key={ticker.ticker} value={ticker.ticker}>
                            <Checkbox
                                checked={
                                    uncheckedTickers.indexOf(ticker.ticker) > -1
                                }
                            />
                            <ListItemText primary={ticker.ticker} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ width: 250 }}>
                <InputLabel id="demo-simple-select-label">
                    Refresh Delay
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Refrsh_dly"
                    onChange={handleDelayChange}
                    defaultValue={5}
                >
                    <MenuItem value={1}>One second</MenuItem>
                    <MenuItem value={5}>Five seconds</MenuItem>
                    <MenuItem value={30}>Thirty seconds</MenuItem>
                    <MenuItem value={60}>One minute</MenuItem>
                </Select>
            </FormControl>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                limit={1}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnHover={false}
                theme="light"
            />
        </div>
    );
};

export default TableControls;
