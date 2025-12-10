<script lang="ts">
    const activities = [
        {
            type: "push",
            repo: "Xarth-Mai",
            desc: "Pushed 3 commits to main",
            time: "2h ago",
        },
        {
            type: "pr",
            repo: "svelte",
            desc: "Opened PR #1042: Fix flicker",
            time: "5h ago",
        },
        {
            type: "star",
            repo: "bun",
            desc: "Starred jarred/bun",
            time: "1d ago",
        },
    ];
</script>

<ul class="activity-list">
    {#each activities as act}
        <li class="activity-item">
            <div class="icon-box type-{act.type}"></div>
            <div class="content">
                <div class="repo">{act.repo}</div>
                <div class="desc">{act.desc}</div>
            </div>
            <div class="time">{act.time}</div>
        </li>
    {/each}
</ul>

<style>
    .activity-list {
        list-style: none;
        padding: 0;
        margin: var(--spacing-md) 0 0 0;
    }

    .activity-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-sm) 0;
        border-bottom: 1px solid var(--border-color);
    }

    .activity-item:last-child {
        border-bottom: none;
    }

    .icon-box {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
    }

    /* Just color coding types for now, icons later */
    .type-push {
        border: 1px solid var(--accent-color);
    }
    .type-pr {
        border: 1px solid #a855f7;
    }
    .type-star {
        border: 1px solid #eab308;
    }

    .content {
        flex-grow: 1;
        min-width: 0; /* Critical for text wrapping in flex container */
    }
    .repo {
        font-weight: 500;
        font-size: 14px;
        color: var(--text-main);
    }
    .desc {
        font-size: 13px;
        color: var(--text-dim);
        white-space: normal;
        overflow-wrap: break-word;
    }
    .time {
        font-size: 12px;
        color: var(--text-dim);
    }
</style>
