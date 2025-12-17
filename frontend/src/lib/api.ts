import type { UserStatus, ContributionGrid, TechStackItem, ActivityItem } from './types';

const API_BASE = '/api';

async function fetchJson<T>(endpoint: string): Promise<T> {
    // Simulate network delay
    await sleep(2500);

    if (mocks[endpoint]) {
        console.log(`[MockAPI] Serving ${endpoint}`);
        return mocks[endpoint] as T;
    }

    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    getStatus: () => fetchJson<UserStatus>('/status'),

    getQuote: () => fetchJson<{ quote: string }>('/quote'),

    getContributions: () => fetchJson<ContributionGrid>('/contributions'),

    getTechStack: () => fetchJson<TechStackItem[]>('/stack'),

    getActivityFeed: () => fetchJson<ActivityItem[]>('/activity'),
};


// Mock Data
const mocks: Record<string, any> = {
    '/status': {
        label: "Coding",
        color: "#a78bfa", // Purple accent
        pulse: true
    },
    '/quote': {
        quote: "Stay hungry, stay foolish."
    },
    '/contributions': {
        levels: Array.from({ length: 140 }, () => Math.floor(Math.random() * 5))
    },
    '/stack': [
        { name: "Svelte", color: "#ff3e00", percent: 35.29 },
        { name: "Rust", color: "#dea584", percent: 28.75 },
        { name: "TypeScript", color: "#3178c6", percent: 21.22 },
        { name: "Go", color: "#00add8", percent: 9.82 },
        { name: "CSS", color: "#563d7c", percent: 4.92 },
    ],
    '/activity': Array.from({ length: 6 }, () => [
        { type: "push", repo: "Xarth-Mai", desc: "Pushed 3 commits to main", time: "2h ago" },
        { type: "pr", repo: "svelte", desc: "Opened PR #1042: Fix flicker", time: "5h ago" },
        { type: "star", repo: "bun", desc: "Starred jarred/bun", time: "1d ago" },
    ]).flat()
};

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}