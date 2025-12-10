<script lang="ts">
    const stack = [
        { name: "Rust", color: "#dea584", percent: 40 },
        { name: "Svelte", color: "#ff3e00", percent: 30 },
        { name: "TS", color: "#3178c6", percent: 20 },
        { name: "Go", color: "#00add8", percent: 10 },
    ];
</script>

<div class="glass-panel stack-card">
    <h3>Tech Stack</h3>

    <div class="bars-container">
        {#each stack as tech}
            <div class="tech-row">
                <span class="tech-name">{tech.name}</span>
                <div class="bar-bg">
                    <div
                        class="bar-fill"
                        style="width: {tech.percent}%; background-color: {tech.color};"
                    ></div>
                </div>
                <span class="tech-pct">{tech.percent}%</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .stack-card {
        height: 100%;
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .tech-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: 14px;
        margin-bottom: var(--spacing-sm);
    }

    .tech-name {
        min-width: 50px;
    }

    .bar-bg {
        flex-grow: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        border-radius: 3px;
    }

    .tech-pct {
        font-size: 12px;
        color: var(--text-dim);
        min-width: 30px;
        text-align: right;
    }
</style>
