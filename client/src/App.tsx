import TickersTable from "./components/TickersTable";
import "./App.scss";
import { Container } from "@mui/material";
import TableControls from "./components/TableControls/TableControls";
const App = () => {
    return (
        <Container>
            <TickersTable />
            <TableControls />
        </Container>
    );
};

export default App;
