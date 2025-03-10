const API_BASE_URL = "http://localhost:8080";

export const loginUser = async (email, password, role) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${role}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        return data;
    } catch (error) {
        throw new Error(error.message || "Something went wrong.");
    }
};

export const fetchUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const fetchAccounts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/accounts`);
        if (!response.ok) {
            throw new Error("Failed to fetch accounts");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return [];
    }
};