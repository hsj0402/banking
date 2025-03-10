import { useEffect, useState } from 'react';
import { fetchUsers, fetchAccounts } from '../services/authService';

const BankerAccounts = () => {
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            return acc.transaction_type === "deposit"
                ? total + parseFloat(acc.amount)
                : total - parseFloat(acc.amount);
        }, 0);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Customer Accounts</h2>
            <hr className="border border-black w-full mb-4" />

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={user.id}
                            className={`border border-gray-300 cursor-pointer ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                }`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <td className="border border-gray-300 p-2">{user.name}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2 font-bold">
                                ${calculateBalance(user.id)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-2">
                            {selectedUser.name}'s Transaction History
                        </h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">Type</th>
                                    <th className="border border-gray-300 p-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts
                                    .filter((acc) => acc.user_id === selectedUser.id)
                                    .map((acc, index) => (
                                        <tr
                                            key={acc.id}
                                            className={`border border-gray-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                }`}
                                        >
                                            <td
                                                className={`border border-gray-300 p-2 ${acc.transaction_type === "deposit"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {acc.transaction_type}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                ${acc.amount}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                                onClick={() => setSelectedUser(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankerAccounts;
