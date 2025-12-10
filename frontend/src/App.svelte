<script lang="ts">
  import Heatmap from "./lib/components/Heatmap.svelte";
  import ProfileCard from "./lib/components/ProfileCard.svelte";
  import TechStack from "./lib/components/TechStack.svelte";
  import ActivityFeed from "./lib/components/ActivityFeed.svelte";

  import { api } from "./api";
  import type { UserStatus } from "./types";

  // Static Configuration
  const staticUser = {
    username: "Xarth",
  };

  let status: UserStatus | null = $state(null);
  let quote = $state("");

  $effect(() => {
    api.getStatus().then((data) => (status = data));
    api.getQuote().then((data) => (quote = data.quote));
  });

  let mouseX = $state(0);
  let mouseY = $state(0);

  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Update CSS variables on the root or specific container
    document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);
  }
</script>

<svelte:window onmousemove={handleMouseMove} />

<div class="cursor-glow" style="left: {mouseX}px; top: {mouseY}px"></div>

<main class="dashboard-container">
  <!-- Left Panel: Profile, Stats, Stack -->
  <div class="left-panel glass-panel">
    <div class="profile-section">
      <!-- Profile is always rendered (static), status is async -->
      <ProfileCard username={staticUser.username} {quote} {status} />
    </div>

    <div class="stats-section">
      <h3>Contribution Activity</h3>
      <Heatmap />
    </div>

    <div class="stack-section">
      <TechStack />
    </div>
  </div>

  <!-- Right Panel: Activity Feed -->
  <div class="right-panel glass-panel">
    <h3>Latest Activity</h3>
    <ActivityFeed />
  </div>
</main>

<style>
  .dashboard-container {
    display: flex;
    gap: var(--spacing-md);
    max-width: 1500px;
    width: 100%;
    align-items: flex-start;
  }

  .left-panel {
    flex: 0 0 var(--golden-ratio-left);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .right-panel {
    flex: 1;
    padding: var(--spacing-lg);
    min-height: 600px; /* Ensure some height match */
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .stats-section,
  .stack-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  /* Responsive */
  @media (max-width: 900px) {
    .dashboard-container {
      flex-direction: column;
    }

    .left-panel,
    .right-panel {
      flex: none;
      width: 100%;
      max-height: none;
      overflow-y: visible;
    }
  }
</style>
