<script lang="ts">
    export let user: { username: string; bio: string; status: string };
</script>

<div class="glass-panel profile-card">
    <div class="avatar-container">
        <div class="avatar-placeholder"></div>
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
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
    }

    .avatar-placeholder {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: #333;
        border: 2px solid var(--border-color);
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
        gap: 12px;
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
