use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Beneficiary {
    pub id: Option<i32>,
    pub name: String,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
}
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Beneficiary {
    pub id: Option<i32>,
    pub name: String,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CreateBeneficiaryPayload {
    pub name: String,
}