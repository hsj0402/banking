import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CustomerTransactions from "./pages/CustomerTransactions";
import BankerAccounts from "./pages/BankerAccounts";

function App() {
  return (
    <div className="bg-[#f6f4ed] h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/customer/transactions" element={<CustomerTransactions />} />
          <Route path="/banker/accounts" element={<BankerAccounts />} />
          {/* <Route path="/customer/transactions/:id" element={<CustomerTransactions />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
