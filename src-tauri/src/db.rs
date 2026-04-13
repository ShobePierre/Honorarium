use rusqlite::Connection;
use std::fs;
use std::path::PathBuf;

pub fn init_db(_app: &tauri::AppHandle) -> Result<Connection, String> {
    // Get the app data directory using environment variables
    #[cfg(target_os = "windows")]
    let app_data_dir = {
        std::env::var("APPDATA")
            .map(|p| PathBuf::from(p).join("Honorarium"))
            .unwrap_or_else(|_| PathBuf::from(".").join("data"))
    };

    #[cfg(target_os = "macos")]
    let app_data_dir = {
        std::env::var("HOME")
            .map(|p| PathBuf::from(p).join("Library").join("Application Support").join("Honorarium"))
            .unwrap_or_else(|_| PathBuf::from(".").join("data"))
    };

    #[cfg(target_os = "linux")]
    let app_data_dir = {
        std::env::var("XDG_DATA_HOME")
            .or_else(|_| std::env::var("HOME").map(|p| {
                PathBuf::from(p).join(".local").join("share").to_string_lossy().to_string()
            }))
            .map(|p| PathBuf::from(p).join("Honorarium"))
            .unwrap_or_else(|_| PathBuf::from(".").join("data"))
    };

    // Ensure app data directory exists
    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app directory: {}", e))?;

    let db_path = app_data_dir.join("honorarium.db");

    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database: {}", e))?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS beneficiaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )
    .map_err(|e| format!("Failed to create table: {}", e))?;

    Ok(conn)
}