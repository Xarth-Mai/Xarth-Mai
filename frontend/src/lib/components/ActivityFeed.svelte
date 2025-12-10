<script lang="ts">
    import { api } from "../../api";
    import type { ActivityItem } from "../../types";

    let activities: ActivityItem[] = $state([]);

    $effect(() => {
        api.getActivityFeed().then((data) => (activities = data));
    });
</script>

<div class="activity-wrapper">
    <!-- Real Content with CSS grid transition -->
    <ul class="activity-list real-content" class:open={activities.length > 0}>
        <div class="inner">
            {#each activities as activity}
                <li class="activity-item">
                    <div class="icon-box type-{activity.type}"></div>
                    <div class="content">
                        <div class="repo">{activity.repo}</div>
                        <div class="desc">{activity.desc}</div>
                    </div>
                    <div class="time">{activity.time}</div>
                </li>
            {/each}
        </div>
    </ul>

    <!-- Skeleton (only visible when empty) -->
    {#if activities.length === 0}
        <ul class="activity-list skeleton-list">
            {#each Array(9) as _}
                <li class="activity-item">
                    <div class="icon-box skeleton"></div>
                    <div class="content">
                        <div
                            class="title skeleton"
                            style="width: 60%; height: 16px; margin-bottom: 8px;"
                        ></div>
                        <div
                            class="desc skeleton"
                            style="width: 80%; height: 12px;"
                        ></div>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .activity-wrapper {
        position: relative;
    }

    .activity-list {
        list-style: none;
        padding: 0;
        margin: var(--spacing-md) 0 0 0;
    }

    /* CSS Grid Height Transition */
    .real-content {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.5s ease-out;
    }

    .real-content.open {
        grid-template-rows: 1fr;
    }

    .inner {
        min-height: 0;
    }

    .skeleton-list {
        /* Position absolutely so it doesn't affect layout when real content loads */
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
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
