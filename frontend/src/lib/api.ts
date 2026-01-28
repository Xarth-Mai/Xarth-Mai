import type { DashboardData } from './types';

const API_BASE = '/api';

async function fetchJson<T>(endpoint: string): Promise<T> {
    // 集中式 Mock 拦截
    if (endpoint === '/dashboard') {
        console.log(`[MockAPI] Serving Aggregated Dashboard`);
        return mockDashboard as unknown as T;
    }

    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    // 唯一的入口
    getDashboard: () => fetchJson<DashboardData>('/dashboard'),
};

// 聚合的 Mock Data
const mockDashboard: DashboardData = {
    status: {
        label: "Coding",
        color: "#a78bfa",
        pulse: true
    },
    quote: {
        quote: "Stay hungry, stay foolish."
    },
    contributions: {
        levels: Array.from({ length: 140 }, () => Math.floor(Math.random() * 5))
    },
    stack: [
        { name: "Svelte", color: "#ff3e00", percent: 35.29 },
        { name: "Rust", color: "#dea584", percent: 28.75 },
        { name: "TypeScript", color: "#3178c6", percent: 21.22 },
        { name: "Go", color: "#00add8", percent: 9.82 },
        { name: "CSS", color: "#563d7c", percent: 4.92 },
    ],
    activity: [
        { type: "push", repo: "Xarth-Mai", desc: "Pushed 3 commits to main", time: "2h ago" },
        { type: "pr", repo: "svelte", desc: "Opened PR #1042: Fix flicker", time: "5h ago" },
        { type: "star", repo: "bun", desc: "Starred jarred/bun", time: "1d ago" },
    ]
};
