mod models;
mod github;
mod cache;

use axum::{
    routing::get,
    Json, Router, response::IntoResponse,
};
use std::sync::Arc;
use tokio::net::UnixListener;
use tower_http::services::ServeDir;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::fs;

use crate::github::GithubClient;
use crate::cache::Cache;

const SOCK_PATH: &str = "/run/xarth-mai/app.sock";
const VERSION: &str = "0.1.0-rust";

struct AppState {
    cache: Cache,
}

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let github_username = std::env::var("GITHUB_USER").unwrap_or_else(|_| "Xarth-Mai".into());
    let github_token = std::env::var("GITHUB_TOKEN").ok();
    
    let github_client = Arc::new(GithubClient::new(&github_username, github_token));
    let cache = Cache::new();
    
    // Start background refresh (every 4 hours as requested)
    cache.start_refresh_loop(github_client, 4);

    let state = Arc::new(AppState { cache });

    // API Routes
    let api_router = Router::new()
        .route("/dashboard", get(get_dashboard))
        .route("/version", get(get_version))
        .with_state(state);

    // Main Router
    let app = Router::new()
        .nest("/api", api_router)
        .fallback_service(
            ServeDir::new("./dist")
                .fallback(get(serve_index))
        )
        .layer(TraceLayer::new_for_http());

    // Clean up old socket
    if fs::metadata(SOCK_PATH).is_ok() {
        let _ = fs::remove_file(SOCK_PATH);
    }

    // Ensure directory exists
    if let Some(parent) = std::path::Path::new(SOCK_PATH).parent() {
        let _ = fs::create_dir_all(parent);
    }

    let listener = UnixListener::bind(SOCK_PATH).expect("Failed to bind to unix socket");
    tracing::info!("Listening on {}", SOCK_PATH);

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn serve_index() -> impl IntoResponse {
    match fs::read_to_string("./dist/index.html") {
        Ok(index) => index.into_response(),
        Err(_) => (axum::http::StatusCode::NOT_FOUND, "Not Found").into_response(),
    }
}

async fn get_dashboard(
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
) -> impl IntoResponse {
    match state.cache.get_data().await {
        Some(data) => Json(data).into_response(),
        None => (axum::http::StatusCode::SERVICE_UNAVAILABLE, "Data not yet available").into_response(),
    }
}

async fn get_version() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "version": VERSION }))
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    tracing::info!("Shutdown signal received, cleaning up...");
    let _ = fs::remove_file(SOCK_PATH);
}
