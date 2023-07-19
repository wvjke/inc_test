import { TableCell } from "@mui/material";
import { ITicker } from "../../redux/slices/tickerSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import "./ticker.scss";
interface ITickerProps {
    ticker: ITicker;
}

const Ticker: React.FC<ITickerProps> = ({ ticker }) => {
    const [stateFavoriteTickers, setStateFavoriteTickers] = useState<string[]>(
        (localStorage.getItem("favorite_tickers") ?? "").split(",")
    );

    const bcgColor =
        ticker.change > 0 ? "rgb(230,244,234)" : "rgb(252,232,230)";
    const txtColor = ticker.change > 0 ? "rgb(19, 115, 51)" : "rgba(165,14,14)";

    const handleFavoriteTickers = () => {
        const favoriteTickers = localStorage.getItem("favorite_tickers");
        const favoriteTickersArray = favoriteTickers
            ? favoriteTickers.split(",")
            : [];

        if (favoriteTickersArray.includes(ticker.ticker)) {
            const newFavoriteTickersArray = favoriteTickersArray.filter(
                (item) => item !== ticker.ticker
            );
            const newFavoriteTickers = newFavoriteTickersArray.join(",");
            localStorage.setItem("favorite_tickers", newFavoriteTickers);
            setStateFavoriteTickers(newFavoriteTickersArray);
        } else {
            const newFavoriteTickersArray = [
                ...favoriteTickersArray,
                ticker.ticker,
            ];
            const newFavoriteTickers = newFavoriteTickersArray.join(",");
            localStorage.setItem("favorite_tickers", newFavoriteTickers);
            setStateFavoriteTickers(newFavoriteTickersArray);
        }
    };

    return (
        <>
            <TableCell className="ticker_cell">{ticker.ticker}</TableCell>
            <TableCell className="ticker_cell">{ticker.price} $</TableCell>
            <TableCell className="ticker_cell">
                <div
                    style={{
                        color: txtColor,
                    }}
                >
                    {ticker.change}
                </div>
            </TableCell>
            <TableCell className="ticker_cell">
                <div
                    className="ticker_change_percent"
                    style={{
                        color: txtColor,
                        backgroundColor: bcgColor,
                    }}
                >
                    <span aria-hidden="true">
                        <svg
                            focusable="false"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={txtColor}
                        >
                            {ticker.change > 0 ? (
                                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                            ) : (
                                <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
                            )}
                        </svg>
                    </span>
                    {ticker.change_percent}%
                </div>
            </TableCell>
            <TableCell className="ticker_cell" align="center">
                <VisibilityIcon
                    color={
                        stateFavoriteTickers.includes(ticker.ticker)
                            ? "info"
                            : "disabled"
                    }
                    onClick={handleFavoriteTickers}
                    sx={{ cursor: "pointer", transition: "color 450ms" }}
                />
            </TableCell>
        </>
    );
};

export default Ticker;
