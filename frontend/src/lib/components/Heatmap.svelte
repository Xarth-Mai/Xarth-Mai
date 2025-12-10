<script lang="ts">
    // Mock Contribution Data (Last 52 weeks would be huge, mocking a smaller grid for visual test)
    const weeks = 20;
    const days = 7;

    // 0-4 intensity
    const getRandomLevel = () => Math.floor(Math.random() * 5);
    const contributions = Array.from({ length: weeks * days }, getRandomLevel);
</script>

<div class="heatmap-grid">
    {#each contributions as level}
        <div class="day level-{level}"></div>
    {/each}
</div>

<div class="legend">
    <span>Less</span>
    <div class="day level-0"></div>
    <div class="day level-2"></div>
    <div class="day level-4"></div>
    <span>More</span>
</div>

<style>
    .heatmap-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 16px;
        /* Simplification: Just a flex wrap box for now, standard GH graph is column-major grid */
        height: 140px;
        align-content: flex-start;
    }

    .day {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background-color: rgba(255, 255, 255, 0.05);
    }

    /* Dynamic scales using accent color */
    .level-0 {
        background-color: rgba(255, 255, 255, 0.05);
    }
    .level-1 {
        background-color: var(--accent-color);
        opacity: 0.2;
    }
    .level-2 {
        background-color: var(--accent-color);
        opacity: 0.4;
    }
    .level-3 {
        background-color: var(--accent-color);
        opacity: 0.7;
    }
    .level-4 {
        background-color: var(--accent-color);
        opacity: 1;
        box-shadow: 0 0 6px var(--accent-color);
    }

    .legend {
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--text-dim);
        justify-content: flex-end;
    }
</style>
