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

let allUsersData = []; 
let currentDisplayData = []; 

async function loadDashboard() {
    const usersContainer = document.getElementById('usersContainer');
    const loadingMsg = document.getElementById('loadingMessage');

    try {
        const [users, posts, comments] = await Promise.all([
            getUsers(),
            getPosts(),
            getComments()
        ]);

        loadingMsg.style.display = 'none';

        const userStats = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            const postsCount = userPosts.length;
            const postIds = userPosts.map(post => post.id);
            const userComments = comments.filter(comment => postIds.includes(comment.postId));
            const commentsCount = userComments.length;

            return { ...user, postsCount, commentsCount };
        });

        allUsersData = userStats;
        currentDisplayData = [...allUsersData];
        renderUsers(currentDisplayData);
        setupListeners();

    } catch (error) {
        loadingMsg.innerHTML = `
            <div class="error">
                 Failed to load dashboard data.<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

function renderUsers(users) {
    const container = document.getElementById('usersContainer');
    container.innerHTML = '';

    if (users.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d; font-size: 18px;">
                 No users found. Try a different search term.
            </div>
        `;
        return;
    }

    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${user.name}</h3>
            </div>
            <div class="card-body">
                <div class="email">✉️ ${user.email}</div>
                <div class="user-stats">
                    <div>
                        <span>${user.postsCount}</span>
                        <small>Posts</small>
                    </div>
                    <div>
                        <span>${user.commentsCount}</span>
                        <small>Comments</small>
                    </div>
                </div>
                <button class="details-btn" data-id="${user.id}">
                    View Details
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filtered = allUsersData.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        currentDisplayData = filtered;
        applyCurrentSortAndRender();
    });

    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', () => {
        applyCurrentSortAndRender();
    });

    const container = document.getElementById('usersContainer');
    container.addEventListener('click', (event) => {
        const btn = event.target.closest('.details-btn');
        if (btn) {
            const userId = parseInt(btn.dataset.id);
            const user = allUsersData.find(u => u.id === userId);
            if (user) showDetails(user);
        }
    });
}

function applyCurrentSortAndRender() {
    const sortBy = document.getElementById('sortSelect').value;
    let sorted = [...currentDisplayData];
    
    if (sortBy === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'posts') {
        sorted.sort((a, b) => b.postsCount - a.postsCount);
    } else if (sortBy === 'comments') {
        sorted.sort((a, b) => b.commentsCount - a.commentsCount);
    }
    renderUsers(sorted);
}

function showDetails(user) {
    document.getElementById('modalName').innerText = user.name;
    document.getElementById('modalBody').innerHTML = `
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
        <p><strong>Website:</strong> ${user.website || 'N/A'}</p>
        <p><strong>Company:</strong> ${user.company ? user.company.name : 'N/A'}</p>
        <p><strong>Address:</strong> ${user.address ? user.address.city : 'N/A'}</p>
        <hr>
        <p><strong> Posts:</strong> ${user.postsCount}</p>
        <p><strong> Comments:</strong> ${user.commentsCount}</p>
    `;
    document.getElementById('userDetailsModal').classList.remove('hidden');
}

function closeDetails() {
    document.getElementById('userDetailsModal').classList.add('hidden');
}

loadDashboard();
