const express = require("express");
const http = require("http");
const io = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

let fetchInterval = 5000;
let timer;
let socket;

const tickers = ["AAPL", "GOOGL", "MSFT", "AMZN", "FB", "TSLA"];

let initialQuotes = tickers.map((ticker) => ({
    ticker,
    exchange: "NASDAQ",
    price: randomValue(100, 300, 2),
    change: randomValue(0, 200, 2),
    change_percent: randomValue(0, 1, 2),
    dividend: randomValue(0, 1, 2),
    yield: randomValue(0, 2, 2),
    last_trade_time: utcDate(),
}));

function randomValue(min = 0, max = 1, precision = 0) {
    const random = Math.random() * (max - min) + min;
    return random.toFixed(precision);
}

function utcDate() {
    const now = new Date();
    return new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );
}

function getQuotes() {
    const newQuotes = tickers.map((ticker) => {
        const initialQuote = initialQuotes.find(
            (quote) => quote.ticker === ticker
        );
        const randomQuote = {
            ticker,
            exchange: "NASDAQ",
            price: randomValue(100, 300, 2),
            dividend: randomValue(0, 1, 2),
            yield: randomValue(0, 2, 2),
            last_trade_time: utcDate(),
        };

        randomQuote.change = (
            parseFloat(randomQuote.price) - parseFloat(initialQuote.price)
        ).toFixed(2);

        randomQuote.change_percent = (
            ((parseFloat(randomQuote.price) - parseFloat(initialQuote.price)) /
                parseFloat(initialQuote.price)) *
            100
        ).toFixed(2);

        return randomQuote;
    });

    socket.emit("ticker", newQuotes);

    initialQuotes = newQuotes;
}

function trackTickers() {
    socket.emit("ticker", initialQuotes);

    clearInterval(timer);
    timer = setInterval(function () {
        getQuotes();
    }, fetchInterval);

    socket.on("disconnect", function () {
        clearInterval(timer);
    });
}

const app = express();
app.use(cors());
const server = http.createServer(app);

const socketServer = io(server, {
    cors: {
        origin: "*",
    },
});

app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/fetchInterval", function (req, res) {
    const newInterval = req.body.interval;
    fetchInterval = newInterval;

    if (timer) {
        clearInterval(timer);
        timer = setInterval(function () {
            getQuotes();
        }, fetchInterval);
    }

    res.send(`FETCH_INTERVAL updated to: ${fetchInterval}`);
});

socketServer.on("connection", (clientSocket) => {
    socket = clientSocket;
    socket.on("start", () => {
        trackTickers();
    });
});

server.listen(PORT, () => {
    console.log(`Streaming service is running on http://localhost:${PORT}`);
});
