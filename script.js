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

// ----------------------------------------------
// 3. تحميل لوحة المعلومات باستخدام Promise.all
// ----------------------------------------------
async function loadDashboard() {
    const usersContainer = document.getElementById('usersContainer');
    const loadingMsg = document.getElementById('loadingMessage');

    try {
        // (1) جلب البيانات الثلاثة في وقت واحد
        const [users, posts, comments] = await Promise.all([
            getUsers(),
            getPosts(),
            getComments()
        ]);

        // (2) اختفاء رسالة التحميل
        loadingMsg.style.display = 'none';

        // (3) بدء عملية الحساب
        const userStats = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            const postsCount = userPosts.length;

            const postIds = userPosts.map(post => post.id);
            const userComments = comments.filter(comment => postIds.includes(comment.postId));
            const commentsCount = userComments.length;

            return {
                ...user,
                postsCount: postsCount,
                commentsCount: commentsCount
            };
        });

        // (4) عرض البطاقات (هذا هو الجزء المفقود الذي سنضيفه الآن)
        renderUsers(userStats);

    } catch (error) {
        loadingMsg.innerHTML = `
            <div class="error">
                ❌ Failed to load dashboard data.<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// ----------------------------------------------
// 4. دالة رسم البطاقات (تمت إضافتها)
// ----------------------------------------------
function renderUsers(users) {
    const container = document.getElementById('usersContainer');
    container.innerHTML = ''; // تنظيف الحاوية

    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        
        card.innerHTML = `
            <h3>${user.name}</h3>
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
        `;

        container.appendChild(card);
    });
}

// ----------------------------------------------
// 5. تشغيل التطبيق
// ----------------------------------------------
loadDashboard();
