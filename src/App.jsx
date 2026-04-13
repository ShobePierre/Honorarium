import { useState, useEffect } from "react";
import {
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} from "./services/beneficiary";
import "./App.css";

function App() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch beneficiaries on mount
  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBeneficiaries();
      setBeneficiaries(data);
    } catch (err) {
      setError("Failed to fetch beneficiaries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }
    try {
      setError(null);
      await createBeneficiary(name);
      setName("");
      await fetchBeneficiaries();
    } catch (err) {
      setError("Failed to create beneficiary");
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) {
      setError("Name cannot be empty");
      return;
    }
    try {
      setError(null);
      await updateBeneficiary(id, editingName);
      setEditingId(null);
      setEditingName("");
      await fetchBeneficiaries();
    } catch (err) {
      setError("Failed to update beneficiary");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this beneficiary?")) {
      try {
        setError(null);
        await deleteBeneficiary(id);
        await fetchBeneficiaries();
      } catch (err) {
        setError("Failed to delete beneficiary");
        console.error(err);
      }
    }
  };

  const handleStartEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  return (
    <div className="container">
      <h1>Honorarium Management System</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="input-section">
        <h2>Add New Beneficiary</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter beneficiary name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreate()}
          />
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      <div className="list-section">
        <h2>Beneficiaries ({beneficiaries.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : beneficiaries.length === 0 ? (
          <p className="empty-message">No beneficiaries yet. Add one above!</p>
        ) : (
          <table className="beneficiaries-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id}>
                  <td>{beneficiary.id}</td>
                  <td>
                    {editingId === beneficiary.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      beneficiary.name
                    )}
                  </td>
                  <td>
                    {beneficiary.createdAt
                      ? new Date(beneficiary.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {editingId === beneficiary.id ? (
                      <>
                        <button
                          className="btn-save"
                          onClick={() => handleUpdate(beneficiary.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleStartEdit(beneficiary.id, beneficiary.name)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(beneficiary.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;