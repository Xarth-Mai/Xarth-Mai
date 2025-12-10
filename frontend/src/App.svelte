<script lang="ts">
  import Heatmap from "./lib/components/Heatmap.svelte";
  import ProfileCard from "./lib/components/ProfileCard.svelte";
  import TechStack from "./lib/components/TechStack.svelte";
  import ActivityFeed from "./lib/components/ActivityFeed.svelte";

  import { api } from "./lib/api";
  import type { UserStatus } from "./lib/types";

  import { spotlight } from "./lib/actions/spotlight";

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
</script>

<svelte:body use:spotlight />

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
    gap: var(--space-md);
    max-width: var(--layout-max-width);
    width: 100%;
    align-items: flex-start;
  }

  .left-panel {
    flex: 0 0 var(--layout-golden-ratio-left);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    padding: var(--space-lg);
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .right-panel {
    flex: 1;
    padding: var(--space-lg);
    min-height: 600px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .stats-section,
  .stack-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
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
