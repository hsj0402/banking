import { useEffect, useState } from 'react';
import { fetchAccounts, fetchUsers } from '../services/authService';

const CustomerTransactions = () => {
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [transactionType, setTransactionType] = useState(null);
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const usersData = await fetchUsers();
                const accountsData = await fetchAccounts();
                setUsers(usersData);
                setAccounts(accountsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const calculateBalance = (userId) => {
        const userTransactions = accounts.filter(acc => acc.user_id === userId);
        return userTransactions.reduce((total, acc) => {
            return acc.transaction_type === "deposit" ? total + parseFloat(acc.amount) : total - parseFloat(acc.amount);
        }, 0);
    };

    const handleTransaction = (user, type) => {
        setSelectedUser(user);
        setTransactionType(type);
        setBalance(calculateBalance(user.id));
        setAmount("");
        setMessage("");
        setShowPopup(true);
    };

    const handleConfirmTransaction = () => {
        const transactionAmount = parseFloat(amount);

        if (isNaN(transactionAmount) || transactionAmount <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }

        if (transactionType === "withdrawal" && transactionAmount > balance) {
            setMessage("Insufficient Funds");
            return;
        }

        const newBalance = transactionType === "deposit" ? balance + transactionAmount : balance - transactionAmount;
        setBalance(newBalance);

        setAccounts(prevAccounts => [
            ...prevAccounts,
            {
                id: prevAccounts.length + 1,
                user_id: selectedUser.id,
                transaction_type: transactionType,
                amount: transactionAmount
            }
        ]);

        setShowPopup(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Transactions</h2>
            <hr className="border border-black w-full mb-4" />

            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Balance</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                            <td className="border border-gray-300 p-2">{user.name}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2 font-bold">${calculateBalance(user.id)}</td>
                            <td className="border border-gray-300 p-2">
                                <button className="px-2 py-1 bg-green-500 text-white rounded mr-2" onClick={() => handleTransaction(user, "deposit")}>
                                    Deposit
                                </button>
                                <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleTransaction(user, "withdrawal")}>
                                    Withdraw
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">User ID</th>
                        <th className="border border-gray-300 p-2">Transaction Type</th>
                        <th className="border border-gray-300 p-2">Amount</th>
                    </tr>
                </thead>

                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={account.id} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                            <td className="border border-gray-300 p-2">{account.user_id}</td>
                            <td className={`border border-gray-300 p-2 ${account.transaction_type === "deposit" ? "text-green-500" : "text-red-500"}`}>
                                {account.transaction_type}
                            </td>
                            <td className="border border-gray-300 p-2">${account.amount}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

            {showPopup && selectedUser &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-2">{transactionType === "deposit" ? "Deposit Funds" : "Withdraw Funds"}</h3>
                        <p className="mb-2">Available Balance: <strong>${balance}</strong></p>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full p-2 border rounded mb-2"
                        />
                        {message && <p className="text-red-500">{message}</p>}
                        <div className="flex justify-end">
                            <button className="px-4 py-2 bg-gray-400 text-white rounded mr-2" onClick={() => setShowPopup(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleConfirmTransaction}>Confirm</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default CustomerTransactions;
