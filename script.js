const API_BASE = "https://jsonplaceholder.typicode.com";

async function getUsers() {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
}

async function getPosts() {
    const response = await fetch(`${API_BASE}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return await response.json();
}

async function getComments() {
    const response = await fetch(`${API_BASE}/comments`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    return await response.json();
}
