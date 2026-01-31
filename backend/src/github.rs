use crate::models::*;
use chrono::{DateTime, Utc};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, USER_AGENT};
use serde_json::json;
use std::collections::HashMap;

pub struct GithubClient {
    client: reqwest::Client,
    username: String,
    has_token: bool,
}

impl GithubClient {
    pub fn new(username: &str, token: Option<String>) -> Self {
        let mut headers = HeaderMap::new();
        headers.insert(USER_AGENT, HeaderValue::from_static("Xarth-Mai-Backend"));

        let mut has_token = false;
        if let Some(t) = token {
            if let Ok(val) = HeaderValue::from_str(&format!("Bearer {}", t)) {
                headers.insert(AUTHORIZATION, val);
                has_token = true;
            }
        }

        let client = reqwest::Client::builder()
            .default_headers(headers)
            .build()
            .unwrap();

        Self {
            client,
            username: username.to_string(),
            has_token,
        }
    }

    pub async fn fetch_dashboard_data(
        &self,
    ) -> Result<DashboardData, Box<dyn std::error::Error + Send + Sync>> {
        let (events, contributions, language_stats) = tokio::join!(
            self.fetch_events(),
            self.fetch_contributions(),
            self.fetch_language_stats()
        );

        let events = events.unwrap_or_default();
        let levels = contributions.unwrap_or_else(|_| vec![0; 140]);
        let lang_stats = language_stats.unwrap_or_default();

        let stack = self.process_stack(&lang_stats);
        let activity = self.process_activity(&events);

        let status = if self.has_token {
            UserStatus {
                label: "Developing".to_string(),
                color: "#a78bfa".to_string(),
                pulse: true,
            }
        } else {
            UserStatus {
                label: "Demo Mode".to_string(),
                color: "#94a3b8".to_string(),
                pulse: false,
            }
        };

        Ok(DashboardData {
            status,
            quote: Quote {
                quote: "The best way to predict the future is to invent it.".to_string(),
            },
            contributions: ContributionGrid { levels },
            stack,
            activity,
        })
    }

    async fn fetch_language_stats(
        &self,
    ) -> Result<HashMap<String, u64>, Box<dyn std::error::Error + Send + Sync>> {
        if !self.has_token {
            let mut mock = HashMap::new();
            mock.insert("Rust".to_string(), 150000);
            mock.insert("TypeScript".to_string(), 80000);
            mock.insert("Svelte".to_string(), 45000);
            mock.insert("Python".to_string(), 30000);
            mock.insert("Go".to_string(), 20000);
            return Ok(mock);
        }

        // GraphQL query to get language breakdown for all non-fork repos
        let query = json!({
            "query": format!(r#"
                query {{
                    user(login: "{}") {{
                        repositories(first: 100, isFork: false, ownerAffiliations: OWNER, orderBy: {{field: UPDATED_AT, direction: DESC}}) {{
                            nodes {{
                                languages(first: 10, orderBy: {{field: SIZE, direction: DESC}}) {{
                                    edges {{
                                        size
                                        node {{
                                            name
                                            color
                                        }}
                                    }}
                                }}
                            }}
                        }}
                    }}
                }}
            "#, self.username)
        });

        let response = self
            .client
            .post("https://api.github.com/graphql")
            .json(&query)
            .send()
            .await
            .map_err(|e| {
                eprintln!(
                    "[GitHub API] GraphQL request failed (language stats): url=https://api.github.com/graphql, error={}",
                    e
                );
                e
            })?;

        let status = response.status();
        if !status.is_success() {
            eprintln!(
                "[GitHub API] GraphQL returned non-success status (language stats): status={}, user={}",
                status, self.username
            );
        }

        let resp: serde_json::Value = response.json().await.map_err(|e| {
            eprintln!(
                "[GitHub API] Failed to parse GraphQL response (language stats): error={}",
                e
            );
            e
        })?;

        // Check for GraphQL errors in response
        if let Some(errors) = resp.get("errors") {
            eprintln!(
                "[GitHub API] GraphQL response contains errors (language stats): errors={}",
                errors
            );
        }

        let mut totals: HashMap<String, u64> = HashMap::new();

        if let Some(nodes) = resp
            .get("data")
            .and_then(|d| d.get("user"))
            .and_then(|u| u.get("repositories"))
            .and_then(|r| r.get("nodes"))
            .and_then(|n| n.as_array())
        {
            for repo in nodes {
                if let Some(edges) = repo
                    .get("languages")
                    .and_then(|l| l.get("edges"))
                    .and_then(|e| e.as_array())
                {
                    for edge in edges {
                        if let (Some(size), Some(name)) = (
                            edge.get("size").and_then(|s| s.as_u64()),
                            edge.get("node")
                                .and_then(|n| n.get("name"))
                                .and_then(|n| n.as_str()),
                        ) {
                            *totals.entry(name.to_string()).or_insert(0) += size;
                        }
                    }
                }
            }
        }

        Ok(totals)
    }

    async fn fetch_events(&self) -> Result<Vec<GithubEvent>, reqwest::Error> {
        if !self.has_token {
            return Ok(vec![]); // Will be processed as empty activity
        }
        let url = format!(
            "https://api.github.com/users/{}/events?per_page=30",
            self.username
        );

        let response = self.client.get(&url).send().await.map_err(|e| {
            eprintln!(
                "[GitHub API] Events request failed: url={}, error={}",
                url, e
            );
            e
        })?;

        let status = response.status();
        if !status.is_success() {
            eprintln!(
                "[GitHub API] Events returned non-success status: url={}, status={}",
                url, status
            );
        }

        response.json().await.map_err(|e| {
            eprintln!(
                "[GitHub API] Failed to parse events response: url={}, error={}",
                url, e
            );
            e
        })
    }

    async fn fetch_contributions(
        &self,
    ) -> Result<Vec<i32>, Box<dyn std::error::Error + Send + Sync>> {
        if !self.has_token {
            // Mock 140 days (20 weeks) of contribution levels (0-4)
            let mut mock_levels = Vec::with_capacity(140);
            for i in 0..140 {
                mock_levels.push((i % 5) as i32);
            }
            return Ok(mock_levels);
        }

        let query = json!({
            "query": format!(r#"
                query {{
                  user(login: "{}") {{
                    contributionsCollection {{
                      contributionCalendar {{
                        weeks {{
                          contributionDays {{
                            contributionLevel
                          }}
                        }}
                      }}
                    }}
                  }}
                }}
            "#, self.username)
        });

        let response = self
            .client
            .post("https://api.github.com/graphql")
            .json(&query)
            .send()
            .await
            .map_err(|e| {
                eprintln!(
                    "[GitHub API] GraphQL request failed (contributions): url=https://api.github.com/graphql, error={}",
                    e
                );
                e
            })?;

        let status = response.status();
        if !status.is_success() {
            eprintln!(
                "[GitHub API] GraphQL returned non-success status (contributions): status={}, user={}",
                status, self.username
            );
        }

        let resp: GqlResponse = response.json().await.map_err(|e| {
            eprintln!(
                "[GitHub API] Failed to parse GraphQL response (contributions): error={}",
                e
            );
            e
        })?;

        let mut levels = Vec::new();
        for week in resp
            .data
            .user
            .contributions_collection
            .contribution_calendar
            .weeks
        {
            for day in week.contribution_days {
                let level = match day.contribution_level.as_str() {
                    "NONE" => 0,
                    "FIRST_QUARTILE" => 1,
                    "SECOND_QUARTILE" => 2,
                    "THIRD_QUARTILE" => 3,
                    "FOURTH_QUARTILE" => 4,
                    _ => 0,
                };
                levels.push(level);
            }
        }

        // Return the last 20 weeks (140 days)
        if levels.len() > 140 {
            levels = levels.split_off(levels.len() - 140);
        }

        Ok(levels)
    }

    fn process_stack(&self, lang_stats: &HashMap<String, u64>) -> Vec<TechStackItem> {
        let total: u64 = lang_stats.values().sum();

        if total == 0 {
            return vec![];
        }

        let mut stack: Vec<TechStackItem> = lang_stats
            .iter()
            .map(|(name, &bytes)| TechStackItem {
                name: name.clone(),
                color: self.get_color_for_lang(name),
                percent: ((bytes as f64 / total as f64) * 100.0 * 10.0).round() as f32 / 10.0,
            })
            .collect();

        stack.sort_by(|a, b| b.percent.partial_cmp(&a.percent).unwrap());
        stack.truncate(8);
        stack
    }

    fn process_activity(&self, events: &[GithubEvent]) -> Vec<ActivityItem> {
        events
            .iter()
            .filter_map(|e| {
                let (activity_type, desc) = match e.r#type.as_str() {
                    "PushEvent" => {
                        let commit_msg = e
                            .payload
                            .commits
                            .as_ref()
                            .and_then(|c| c.first())
                            .map(|c| c.message.as_str())
                            .unwrap_or("Pushed commits");
                        (ActivityType::Push, commit_msg.to_string())
                    }
                    "PullRequestEvent" => {
                        let action = e.payload.action.as_deref().unwrap_or("opened");
                        (ActivityType::Pr, format!("{} a pull request", action))
                    }
                    "WatchEvent" => (ActivityType::Star, "Starred a repository".to_string()),
                    "ForkEvent" => (ActivityType::Fork, "Forked a repository".to_string()),
                    _ => return None,
                };

                let time = DateTime::parse_from_rfc3339(&e.created_at)
                    .map(|dt| {
                        let now = Utc::now();
                        let diff = now.signed_duration_since(dt.with_timezone(&Utc));
                        if diff.num_days() > 0 {
                            format!("{}d ago", diff.num_days())
                        } else if diff.num_hours() > 0 {
                            format!("{}h ago", diff.num_hours())
                        } else {
                            format!("{}m ago", diff.num_minutes())
                        }
                    })
                    .unwrap_or_else(|_| "recently".to_string());

                Some(ActivityItem {
                    r#type: activity_type,
                    repo: e
                        .repo
                        .name
                        .clone()
                        .split('/')
                        .last()
                        .unwrap_or(&e.repo.name)
                        .to_string(),
                    desc,
                    time,
                })
            })
            .collect()
    }

    fn get_color_for_lang(&self, lang: &str) -> String {
        match lang {
            "Rust" => "#dea584".to_string(),
            "TypeScript" => "#3178c6".to_string(),
            "JavaScript" => "#f1e05a".to_string(),
            "Svelte" => "#ff3e00".to_string(),
            "Go" => "#00add8".to_string(),
            "Python" => "#3572a5".to_string(),
            "HTML" => "#e34c26".to_string(),
            "CSS" => "#563d7c".to_string(),
            "Vue" => "#41b883".to_string(),
            "Swift" => "#f05138".to_string(),
            _ => "#8b949e".to_string(),
        }
    }
}
