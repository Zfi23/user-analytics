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

        // (3) بدء عملية الحساب وعرض البطاقات (سنكتبها في الخطوة التالية)
        // حساب عدد المقالات والتعليقات لكل مستخدم (سنقوم بها الآن)
        const userStats = users.map(user => {
            // عدد المقالات: نبحث في المصفوفة posts عن كل مقالة userId يساوي user.id
            const userPosts = posts.filter(post => post.userId === user.id);
            const postsCount = userPosts.length;

            // عدد التعليقات: (أصعب قليلاً)
            // 1. نحتاج أولاً للحصول على أرقام (IDs) المقالات التي كتبها هذا المستخدم
            const postIds = userPosts.map(post => post.id);
            // 2. نبحث في التعليقات عن كل تعليق postId موجود ضمن قائمة postIds
            const userComments = comments.filter(comment => postIds.includes(comment.postId));
            const commentsCount = userComments.length;

            // إرجاع كائن (Object) يحتوي على بيانات المستخدم + الإحصائيات
            return {
                ...user,
                postsCount: postsCount,
                commentsCount: commentsCount
            };
        });

        // عرض النتيجة في الـ Console للتأكد (سنقوم بعرضها في الشاشة بالخطوة التالية)
        console.log("البيانات جاهزة:", userStats);
        // renderUsers(userStats); // سنقوم بتفعيل هذا السطر في الخطوة القادمة

    } catch (error) {
        // إذا حدث خطأ
        loadingMsg.innerHTML = `
            <div class="error">
                ❌ Failed to load dashboard data.<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// ----------------------------------------------
// 4. تشغيل التطبيق
// ----------------------------------------------
loadDashboard();
