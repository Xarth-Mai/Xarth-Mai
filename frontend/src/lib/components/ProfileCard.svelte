<script lang="ts">
    export let user: { username: string; bio: string; status: string };
</script>

<div class="profile-card">
    <div class="avatar-container">
        <img src="/avatar.png" alt={user.username} class="avatar-img" />
        <div class="status-dot {user.status}"></div>
    </div>

    <h2>{user.username}</h2>
    <p>{user.bio}</p>

    <div class="social-links">
        <button class="icon-btn">GH</button>
        <button class="icon-btn">X</button>
    </div>
</div>

<style>
    .profile-card {
        height: 100%;
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--spacing-sm);
    }

    .avatar-img {
        width: var(--avatar-size);
        height: var(--avatar-size);
        border-radius: 50%;
        border: 2px solid var(--border-color);
        object-fit: cover;
    }

    .avatar-container {
        position: relative;
    }

    .status-dot {
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid var(--bg-color);
    }

    .status-dot.coding {
        background-color: var(--accent-color);
        box-shadow: 0 0 8px var(--accent-color);
    }
    .status-dot.sleeping {
        background-color: #555;
    }

    .social-links {
        margin-top: auto;
        display: flex;
        gap: var(--spacing-sm);
    }

    .icon-btn {
        background: rgba(255, 255, 255, 0.05);
        border: none;
        color: var(--text-dim);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-main);
    }
</style>
