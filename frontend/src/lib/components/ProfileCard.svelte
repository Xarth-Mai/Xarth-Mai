<script lang="ts">
    import type { UserStatus } from "../../types";

    // Static Props
    export let username: string = "";
    export let quote: string = "";

    // Dynamic Status Prop
    export let status: UserStatus | null = null;

    let imageLoaded = false;
</script>

<div class="profile-card">
    <div class="avatar-container">
        <!-- Skeleton Avatar (Visible until loaded) -->
        {#if !imageLoaded}
            <div class="skeleton avatar-sk"></div>
        {/if}

        <!-- Real Avatar (Hidden until loaded) -->
        <img
            src="/avatar.png"
            alt={username}
            class="avatar-img"
            class:hidden={!imageLoaded}
            on:load={() => (imageLoaded = true)}
        />

        {#if status}
            <div
                class="status-dot"
                style="background-color: {status.color}; box-shadow: {status.pulse
                    ? `0 0 8px ${status.color}`
                    : 'none'}"
                title={status.label}
            ></div>
        {:else}
            <!-- Status Skeleton -->
            <div class="status-dot skeleton status-sk"></div>
        {/if}
    </div>

    <h2>{username}</h2>

    {#if quote}
        <p class="quote-text">{quote}</p>
    {:else}
        <!-- Quote Skeleton -->
        <div class="skeleton text-sk"></div>
    {/if}

    <div class="social-links">
        <button class="icon-btn">GitHub</button>
        <button class="icon-btn">HomePage</button>
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

    .avatar-container {
        position: relative;
        width: var(--avatar-size);
        height: var(--avatar-size);
    }

    .avatar-sk {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid var(--border-color); /* Match border of real img */
        box-sizing: border-box;
    }

    .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid var(--border-color);
        object-fit: cover;
        transition: opacity 0.3s ease;
    }

    .avatar-img.hidden {
        opacity: 0;
        position: absolute; /* Take out of flow to let skeleton sit there? Actually just opacity is enough if container is sized */
        top: 0;
        left: 0;
    }

    .status-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid var(--bg-color);
        transition:
            background-color 0.3s,
            box-shadow 0.3s;
    }

    .status-sk {
        border-color: transparent;
        color: black;
    }

    /* Fix Jitter: Ensure text and skeleton occupy exactly same height */
    .quote-text {
        margin: 4px 0;
        line-height: 1.5;
        font-size: 14px; /* Explicit size */
        min-height: 21px; /* 14px * 1.5 = 21px */
    }

    .text-sk {
        width: 180px;
        height: 14px; /* Matches font-size roughly, but we need to match the block height */
        margin: 4px 0;
        /* To simulate text line height more accurately, we might want height to match font-size and add margin/padding to match line-height */
        box-sizing: content-box;
        padding-top: 3.5px; /* (21 - 14) / 2 approx centering */
        padding-bottom: 3.5px;
        background-clip: content-box; /* Only color the content box 14px height */
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
