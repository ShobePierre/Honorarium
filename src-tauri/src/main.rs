// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use rusqlite::params;

// ============ DATABASE ============
fn init_db(_app: &AppHandle) -> Result<Connection, String> {
    #[cfg(target_os = "windows")]
    let app_data_dir = PathBuf::from("C:\\Users\\pierr\\Desktop\\Projects\\Database");

    #[cfg(target_os = "macos")]
    let app_data_dir = {
        std::env::var("HOME")
            .map(|p| PathBuf::from(p).join("Library").join("Application Support").join("Honorarium"))
            .unwrap_or_else(|_| PathBuf::from(".").join("data"))
    };

    #[cfg(target_os = "linux")]
    let app_data_dir = {
        std::env::var("XDG_DATA_HOME")
            .or_else(|_| std::env::var("HOME").map(|p| 
                PathBuf::from(p).join(".local").join("share").to_string_lossy().to_string()
            ))
            .map(|p| PathBuf::from(p).join("Honorarium"))
            .unwrap_or_else(|_| PathBuf::from(".").join("data"))
    };

    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app directory: {}", e))?;

    let db_path = app_data_dir.join("honorarium.db");
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database: {}", e))?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS beneficiaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            facility TEXT,
            employee_no TEXT,
            rank TEXT,
            subject_code TEXT,
            course_section TEXT,
            day TEXT,
            time TEXT,
            nature TEXT,
            rate_per_hour REAL,
            hours_per_day REAL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )
    .map_err(|e| format!("Failed to create table: {}", e))?;

    Ok(conn)
}

// ============ MODELS ============
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Beneficiary {
    pub id: Option<i32>,
    pub name: String,
    pub facility: Option<String>,
    pub employee_no: Option<String>,
    pub rank: Option<String>,
    pub subject_code: Option<String>,
    pub course_section: Option<String>,
    pub day: Option<String>,
    pub time: Option<String>,
    pub nature: Option<String>,
    pub rate_per_hour: Option<f64>,
    pub hours_per_day: Option<f64>,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BeneficiaryInput {
    pub name: String,
    #[serde(default)]
    pub facility: Option<String>,
    #[serde(default)]
    pub employee_no: Option<String>,
    #[serde(default)]
    pub rank: Option<String>,
    #[serde(default)]
    pub subject_code: Option<String>,
    #[serde(default)]
    pub course_section: Option<String>,
    #[serde(default)]
    pub day: Option<String>,
    #[serde(default)]
    pub time: Option<String>,
    #[serde(default)]
    pub nature: Option<String>,
    #[serde(default)]
    pub rate_per_hour: Option<f64>,
    #[serde(default)]
    pub hours_per_day: Option<f64>,
}

// ============ CRUD COMMANDS ============

#[tauri::command]
fn create_beneficiary(
    app: AppHandle,
    data: BeneficiaryInput,
) -> Result<Beneficiary, String> {
    let conn = init_db(&app)?;
    conn.execute(
        "INSERT INTO beneficiaries (name, facility, employee_no, rank, subject_code, course_section, day, time, nature, rate_per_hour, hours_per_day) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![&data.name, &data.facility, &data.employee_no, &data.rank, &data.subject_code, &data.course_section, &data.day, &data.time, &data.nature, data.rate_per_hour, data.hours_per_day],
    )
    .map_err(|e| format!("Failed to insert: {}", e))?;

    let last_id: i32 = conn
        .query_row("SELECT last_insert_rowid()", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    Ok(Beneficiary {
        id: Some(last_id),
        name: data.name,
        facility: data.facility,
        employee_no: data.employee_no,
        rank: data.rank,
        subject_code: data.subject_code,
        course_section: data.course_section,
        day: data.day,
        time: data.time,
        nature: data.nature,
        rate_per_hour: data.rate_per_hour,
        hours_per_day: data.hours_per_day,
        created_at: Some(chrono::Local::now().to_rfc3339()),
    })
}

#[tauri::command]
fn list_beneficiaries(app: AppHandle) -> Result<Vec<Beneficiary>, String> {
    let conn = init_db(&app)?;
    let mut stmt = conn
        .prepare("SELECT id, name, facility, employee_no, rank, subject_code, course_section, day, time, nature, rate_per_hour, hours_per_day, created_at FROM beneficiaries ORDER BY id DESC")
        .map_err(|e| e.to_string())?;

    let beneficiaries = stmt
        .query_map([], |row| {
            Ok(Beneficiary {
                id: row.get(0)?,
                name: row.get(1)?,
                facility: row.get(2)?,
                employee_no: row.get(3)?,
                rank: row.get(4)?,
                subject_code: row.get(5)?,
                course_section: row.get(6)?,
                day: row.get(7)?,
                time: row.get(8)?,
                nature: row.get(9)?,
                rate_per_hour: row.get(10)?,
                hours_per_day: row.get(11)?,
                created_at: row.get(12)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(beneficiaries)
}

#[tauri::command]
fn update_beneficiary(
    app: AppHandle,
    id: i32,
    data: BeneficiaryInput,
) -> Result<Beneficiary, String> {
    let conn = init_db(&app)?;
    conn.execute(
        "UPDATE beneficiaries SET name = ?1, facility = ?2, employee_no = ?3, rank = ?4, subject_code = ?5, course_section = ?6, day = ?7, time = ?8, nature = ?9, rate_per_hour = ?10, hours_per_day = ?11 WHERE id = ?12",
        params![&data.name, &data.facility, &data.employee_no, &data.rank, &data.subject_code, &data.course_section, &data.day, &data.time, &data.nature, data.rate_per_hour, data.hours_per_day, id],
    )
    .map_err(|e| format!("Failed to update: {}", e))?;

    let mut stmt = conn
        .prepare("SELECT id, name, facility, employee_no, rank, subject_code, course_section, day, time, nature, rate_per_hour, hours_per_day, created_at FROM beneficiaries WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    let beneficiary = stmt
        .query_row(params![id], |row| {
            Ok(Beneficiary {
                id: row.get(0)?,
                name: row.get(1)?,
                facility: row.get(2)?,
                employee_no: row.get(3)?,
                rank: row.get(4)?,
                subject_code: row.get(5)?,
                course_section: row.get(6)?,
                day: row.get(7)?,
                time: row.get(8)?,
                nature: row.get(9)?,
                rate_per_hour: row.get(10)?,
                hours_per_day: row.get(11)?,
                created_at: row.get(12)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(beneficiary)
}

#[tauri::command]
fn delete_beneficiary(app: AppHandle, id: i32) -> Result<bool, String> {
    let conn = init_db(&app)?;
    conn.execute("DELETE FROM beneficiaries WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ============ TAURI APP ============
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_beneficiary,
            list_beneficiaries,
            update_beneficiary,
            delete_beneficiary
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
