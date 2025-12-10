// Xarth-Mai Frontend Types
export interface UserStatus {
    label: string;
    color: string;
    pulse: boolean;
}

export interface ContributionGrid {
    // Array of intensity levels: 0-4
    levels: number[];
}

export interface TechStackItem {
    name: string;
    color: string;
    percent: number;
}

export type ActivityType = 'push' | 'pr' | 'star' | 'fork' | 'comment';

export interface ActivityItem {
    type: ActivityType;
    repo: string;
    desc: string;
    time: string;
}
