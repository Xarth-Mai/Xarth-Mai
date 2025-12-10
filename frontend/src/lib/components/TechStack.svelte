<script lang="ts">
    import { api } from "../api";
    import type { TechStackItem } from "../types";

    let stack: TechStackItem[] = $state([]);

    $effect(() => {
        api.getTechStack().then((data) => (stack = data));
    });
</script>

<div class="glass-panel stack-card">
    <h3>Top Technologies</h3>

    <div class="content-wrapper">
        <div class="real-content" class:open={stack.length > 0}>
            <div class="inner">
                {#each stack as tech}
                    <div class="tech-row">
                        <span class="tech-name">{tech.name}</span>
                        <div class="progress-bar">
                            <div
                                class="progress-fill"
                                style="width: {tech.percent}%; background-color: {tech.color};"
                            ></div>
                        </div>
                        <span class="tech-percent">{tech.percent}%</span>
                    </div>
                {/each}
            </div>
        </div>

        {#if stack.length === 0}
            <!-- Skeleton Stack (Only visible when no stack) -->
            <div class="tech-skeleton">
                {#each Array(4) as _}
                    <div class="skeleton bar-sk"></div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .stack-card {
        height: 100%;
        padding: var(--space-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .tech-row {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: 14px;
        margin-bottom: var(--space-sm);
    }

    .tech-name {
        min-width: 50px;
    }

    .progress-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 1s ease-out;
    }

    .tech-percent {
        min-width: 30px;
        text-align: right;
        color: var(--color-text-secondary);
        font-size: 12px;
    }

    .tech-skeleton {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .bar-sk {
        width: 100%;
        height: 12px;
        border-radius: 6px;
    }

    .content-wrapper {
        min-height: 96px;
        position: relative;
    }

    .real-content {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.5s ease-out; /* Smooth CSS height transition */
    }

    .real-content.open {
        grid-template-rows: 1fr;
    }

    .inner {
        min-height: 0; /* Required for grid transition */
    }
</style>
