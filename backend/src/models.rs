use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserStatus {
    pub label: String,
    pub color: String,
    pub pulse: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ContributionGrid {
    pub levels: Vec<i32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TechStackItem {
    pub name: String,
    pub color: String,
    pub percent: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum ActivityType {
    Push,
    Pr,
    Star,
    Fork,
    Comment,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ActivityItem {
    pub r#type: ActivityType,
    pub repo: String,
    pub desc: String,
    pub time: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Quote {
    pub quote: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DashboardData {
    pub status: UserStatus,
    pub quote: Quote,
    pub contributions: ContributionGrid,
    pub stack: Vec<TechStackItem>,
    pub activity: Vec<ActivityItem>,
}

// GitHub REST API Models
#[derive(Debug, Deserialize)]
pub struct GithubRepo {
    pub language: Option<String>,
    pub fork: bool,
}

#[derive(Debug, Deserialize)]
pub struct GithubEvent {
    pub r#type: String,
    pub repo: GithubEventRepo,
    pub payload: GithubEventPayload,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct GithubEventRepo {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct GithubEventPayload {
    pub action: Option<String>,
    pub commits: Option<Vec<GithubCommit>>,
}

#[derive(Debug, Deserialize)]
pub struct GithubCommit {
    pub message: String,
}

// GraphQL Models for Heatmap
#[derive(Debug, Deserialize)]
pub struct GqlResponse {
    pub data: GqlData,
}

#[derive(Debug, Deserialize)]
pub struct GqlData {
    pub user: GqlUser,
}

#[derive(Debug, Deserialize)]
pub struct GqlUser {
    #[serde(rename = "contributionsCollection")]
    pub contributions_collection: GqlContributionsCollection,
}

#[derive(Debug, Deserialize)]
pub struct GqlContributionsCollection {
    #[serde(rename = "contributionCalendar")]
    pub contribution_calendar: GqlContributionCalendar,
}

#[derive(Debug, Deserialize)]
pub struct GqlContributionCalendar {
    pub weeks: Vec<GqlWeek>,
}

#[derive(Debug, Deserialize)]
pub struct GqlWeek {
    #[serde(rename = "contributionDays")]
    pub contribution_days: Vec<GqlDay>,
}

#[derive(Debug, Deserialize)]
pub struct GqlDay {
    #[serde(rename = "contributionLevel")]
    pub contribution_level: String, // e.g., "FIRST_QUARTILE"
}
