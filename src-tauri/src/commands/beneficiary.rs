use tauri::{command, AppHandle};
use rusqlite::params;

use crate::db::init_db;
use crate::models::beneficiary::{Beneficiary, CreateBeneficiaryPayload};

#[command]
pub fn create_beneficiary(
    app: AppHandle,
    name: String,
) -> Result<Beneficiary, String> {
    let conn = init_db(&app)?;

    conn.execute(
        "INSERT INTO beneficiaries (name) VALUES (?1)",
        params![&name],
    )
    .map_err(|e| e.to_string())?;

    let last_id: i32 = conn
        .query_row("SELECT last_insert_rowid()", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    Ok(Beneficiary {
        id: Some(last_id),
        name,
        created_at: Some(chrono::Local::now().to_rfc3339()),
    })
}

#[command]
pub fn list_beneficiaries(app: AppHandle) -> Result<Vec<Beneficiary>, String> {
    let conn = init_db(&app)?;

    let mut stmt = conn
        .prepare("SELECT id, name, created_at FROM beneficiaries ORDER BY id DESC")
        .map_err(|e| e.to_string())?;

    let beneficiaries = stmt
        .query_map([], |row| {
            Ok(Beneficiary {
                id: row.get(0)?,
                name: row.get(1)?,
                created_at: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(beneficiaries)
}

#[command]
pub fn update_beneficiary(
    app: AppHandle,
    id: i32,
    name: String,
) -> Result<Beneficiary, String> {
    let conn = init_db(&app)?;

    conn.execute(
        "UPDATE beneficiaries SET name = ?1 WHERE id = ?2",
        params![&name, id],
    )
    .map_err(|e| e.to_string())?;

    // Fetch and return the updated beneficiary
    let mut stmt = conn
        .prepare("SELECT id, name, created_at FROM beneficiaries WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    let beneficiary = stmt
        .query_row(params![id], |row| {
            Ok(Beneficiary {
                id: row.get(0)?,
                name: row.get(1)?,
                created_at: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(beneficiary)
}

#[command]
pub fn delete_beneficiary(app: AppHandle, id: i32) -> Result<bool, String> {
    let conn = init_db(&app)?;

    conn.execute("DELETE FROM beneficiaries WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(true)
}