<script lang="ts">
  import Heatmap from './lib/components/Heatmap.svelte';
  import ProfileCard from './lib/components/ProfileCard.svelte';
  import TechStack from './lib/components/TechStack.svelte';
  import ActivityFeed from './lib/components/ActivityFeed.svelte';

  // Mock Data (will be replaced by fetch)
  const user = {
    username: "Xarth",
    bio: "Full-stack Dev / Rust & Svelte",
    status: "coding"
  };
</script>

<main class="bento-grid">
  <div class="profile-area">
    <ProfileCard {user} />
  </div>

  <div class="heatmap-area glass-panel">
    <h3>Contribution Activity</h3>
    <Heatmap />
  </div>

  <div class="stack-area">
    <TechStack />
  </div>

  <div class="feed-area glass-panel">
    <h3>Latest Activity</h3>
    <ActivityFeed />
  </div>
</main>

<style>
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, minmax(180px, auto));
    gap: var(--gap);
    max-width: 1200px;
    width: 100%;
  }

  /* Grid Areas (Mobile First approach recommended, but starting with Desktop for visualizing) */
  .profile-area { grid-column: span 1; grid-row: span 2; }
  .heatmap-area { grid-column: span 2; grid-row: span 2; padding: 24px; display: flex; flex-direction: column;}
  .stack-area   { grid-column: span 1; grid-row: span 1; }
  .feed-area    { grid-column: span 4; grid-row: span 1; padding: 24px; }

  /* Responsive */
  @media (max-width: 900px) {
    .bento-grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
    .profile-area, .heatmap-area, .stack-area, .feed-area {
      grid-column: span 1;
      grid-row: auto;
    }
  }
</style>
