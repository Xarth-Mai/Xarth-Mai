use crate::models::DashboardData;
use crate::github::GithubClient;
use std::sync::Arc;
use tokio::sync::RwLock;
use std::time::Duration;
use tracing::{info, error};

pub struct Cache {
    data: Arc<RwLock<Option<DashboardData>>>,
}

impl Cache {
    pub fn new() -> Self {
        Self {
            data: Arc::new(RwLock::new(None)),
        }
    }

    pub async fn get_data(&self) -> Option<DashboardData> {
        self.data.read().await.clone()
    }

    pub fn start_refresh_loop(&self, client: Arc<GithubClient>, interval_hours: u64) {
        let data_ptr = self.data.clone();
        
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(Duration::from_secs(interval_hours * 3600));
            loop {
                interval.tick().await;
                info!("Refreshing dashboard data from GitHub...");
                
                match client.fetch_dashboard_data().await {
                    Ok(new_data) => {
                        let mut w = data_ptr.write().await;
                        *w = Some(new_data);
                        info!("Dashboard data refreshed successfully.");
                    },
                    Err(e) => {
                        error!("Failed to refresh dashboard data: {}", e);
                    }
                }
            }
        });
    }
}
