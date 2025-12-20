import type { DashboardData } from './types';

const API_BASE = '/api';

async function fetchJson<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    getDashboard: () => fetchJson<DashboardData>('/dashboard'),
};
