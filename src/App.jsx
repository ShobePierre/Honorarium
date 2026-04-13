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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Create form state
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    employee_no: "",
    rank: "",
    subject_code: "",
    course_section: "",
    day: "",
    time: "",
    nature: "",
    rate_per_hour: "",
    hours_per_hour: "",
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    facility: "",
    employee_no: "",
    rank: "",
    subject_code: "",
    course_section: "",
    day: "",
    time: "",
    nature: "",
    rate_per_hour: "",
    hours_per_hour: "",
  });

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setError("Please enter a name");
      return;
    }
    try {
      setError(null);
      const beneficiaryData = {
        name: formData.name,
        facility: formData.facility && formData.facility.trim() ? formData.facility : null,
        employee_no: formData.employee_no && formData.employee_no.trim() ? formData.employee_no : null,
        rank: formData.rank && formData.rank.trim() ? formData.rank : null,
        subject_code: formData.subject_code && formData.subject_code.trim() ? formData.subject_code : null,
        course_section: formData.course_section && formData.course_section.trim() ? formData.course_section : null,
        day: formData.day && formData.day.trim() ? formData.day : null,
        time: formData.time && formData.time.trim() ? formData.time : null,
        nature: formData.nature && formData.nature.trim() ? formData.nature : null,
        rate_per_hour: formData.rate_per_hour && formData.rate_per_hour.trim() ? parseFloat(formData.rate_per_hour) : null,
        hours_per_hour: formData.hours_per_hour && formData.hours_per_hour.trim() ? parseFloat(formData.hours_per_hour) : null,
      };
      await createBeneficiary(beneficiaryData);
      setFormData({
        name: "",
        facility: "",
        employee_no: "",
        rank: "",
        subject_code: "",
        course_section: "",
        day: "",
        time: "",
        nature: "",
        rate_per_hour: "",
        hours_per_hour: "",
      });
      await fetchBeneficiaries();
    } catch (err) {
      setError("Failed to create beneficiary");
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editFormData.name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    try {
      setError(null);
      const beneficiaryData = {
        name: editFormData.name,
        facility: editFormData.facility && editFormData.facility.trim() ? editFormData.facility : null,
        employee_no: editFormData.employee_no && editFormData.employee_no.trim() ? editFormData.employee_no : null,
        rank: editFormData.rank && editFormData.rank.trim() ? editFormData.rank : null,
        subject_code: editFormData.subject_code && editFormData.subject_code.trim() ? editFormData.subject_code : null,
        course_section: editFormData.course_section && editFormData.course_section.trim() ? editFormData.course_section : null,
        day: editFormData.day && editFormData.day.trim() ? editFormData.day : null,
        time: editFormData.time && editFormData.time.trim() ? editFormData.time : null,
        nature: editFormData.nature && editFormData.nature.trim() ? editFormData.nature : null,
        rate_per_hour: editFormData.rate_per_hour && editFormData.rate_per_hour.trim() ? parseFloat(editFormData.rate_per_hour) : null,
        hours_per_hour: editFormData.hours_per_hour && editFormData.hours_per_hour.trim() ? parseFloat(editFormData.hours_per_hour) : null,
      };
      await updateBeneficiary(id, beneficiaryData);
      setEditingId(null);
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

  const handleStartEdit = (beneficiary) => {
    setEditingId(beneficiary.id);
    setEditFormData({
      name: beneficiary.name || "",
      facility: beneficiary.facility || "",
      employee_no: beneficiary.employee_no || "",
      rank: beneficiary.rank || "",
      subject_code: beneficiary.subject_code || "",
      course_section: beneficiary.course_section || "",
      day: beneficiary.day || "",
      time: beneficiary.time || "",
      nature: beneficiary.nature || "",
      rate_per_hour: beneficiary.rate_per_hour ? String(beneficiary.rate_per_hour) : "",
      hours_per_hour: beneficiary.hours_per_hour ? String(beneficiary.hours_per_hour) : "",
    });
  };

  return (
    <div className="container">
      <h1>Honorarium Management System</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="input-section">
        <h2>Add New Beneficiary</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter beneficiary name"
              value={formData.name}
              onChange={handleFormChange}
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div className="form-group">
            <label>Facility</label>
            <input
              type="text"
              name="facility"
              placeholder="Facility"
              value={formData.facility}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Employee No</label>
            <input
              type="text"
              name="employee_no"
              placeholder="Employee No"
              value={formData.employee_no}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Rank</label>
            <input
              type="text"
              name="rank"
              placeholder="Rank"
              value={formData.rank}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Subject Code</label>
            <input
              type="text"
              name="subject_code"
              placeholder="Subject Code"
              value={formData.subject_code}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Course Section</label>
            <input
              type="text"
              name="course_section"
              placeholder="Course Section"
              value={formData.course_section}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Day</label>
            <input
              type="text"
              name="day"
              placeholder="Day"
              value={formData.day}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="text"
              name="time"
              placeholder="Time"
              value={formData.time}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Nature</label>
            <input
              type="text"
              name="nature"
              placeholder="Nature"
              value={formData.nature}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Rate per Hour</label>
            <input
              type="number"
              name="rate_per_hour"
              placeholder="Rate per Hour"
              step="0.01"
              value={formData.rate_per_hour}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Hours per Hour</label>
            <input
              type="number"
              name="hours_per_hour"
              placeholder="Hours per Hour"
              step="0.01"
              value={formData.hours_per_hour}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <button onClick={handleCreate} disabled={loading} className="btn-primary">
          {loading ? "Adding..." : "Add Beneficiary"}
        </button>
      </div>

      <div className="list-section">
        <h2>Beneficiaries ({beneficiaries.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : beneficiaries.length === 0 ? (
          <p className="empty-message">No beneficiaries yet. Add one above!</p>
        ) : editingId ? (
          <div className="edit-form-container">
            <h3>Edit Beneficiary</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Facility</label>
                <input
                  type="text"
                  name="facility"
                  value={editFormData.facility}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Employee No</label>
                <input
                  type="text"
                  name="employee_no"
                  value={editFormData.employee_no}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Rank</label>
                <input
                  type="text"
                  name="rank"
                  value={editFormData.rank}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  name="subject_code"
                  value={editFormData.subject_code}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Course Section</label>
                <input
                  type="text"
                  name="course_section"
                  value={editFormData.course_section}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Day</label>
                <input
                  type="text"
                  name="day"
                  value={editFormData.day}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  name="time"
                  value={editFormData.time}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Nature</label>
                <input
                  type="text"
                  name="nature"
                  value={editFormData.nature}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Rate per Hour</label>
                <input
                  type="number"
                  name="rate_per_hour"
                  step="0.01"
                  value={editFormData.rate_per_hour}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Hours per Hour</label>
                <input
                  type="number"
                  name="hours_per_hour"
                  step="0.01"
                  value={editFormData.hours_per_hour}
                  onChange={handleEditFormChange}
                />
              </div>
            </div>
            <div className="button-group">
              <button
                className="btn-save"
                onClick={() => handleUpdate(editingId)}
              >
                Save
              </button>
              <button
                className="btn-cancel"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <table className="beneficiaries-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Facility</th>
                <th>Employee No</th>
                <th>Rank</th>
                <th>Subject</th>
                <th>Section</th>
                <th>Day</th>
                <th>Time</th>
                <th>Nature</th>
                <th>Rate/Hr</th>
                <th>Hours/Hr</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id}>
                  <td>{beneficiary.id}</td>
                  <td>{beneficiary.name}</td>
                  <td>{beneficiary.facility || "-"}</td>
                  <td>{beneficiary.employee_no || "-"}</td>
                  <td>{beneficiary.rank || "-"}</td>
                  <td>{beneficiary.subject_code || "-"}</td>
                  <td>{beneficiary.course_section || "-"}</td>
                  <td>{beneficiary.day || "-"}</td>
                  <td>{beneficiary.time || "-"}</td>
                  <td>{beneficiary.nature || "-"}</td>
                  <td>{beneficiary.rate_per_hour || "-"}</td>
                  <td>{beneficiary.hours_per_hour || "-"}</td>
                  <td>
                    {beneficiary.createdAt
                      ? new Date(beneficiary.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleStartEdit(beneficiary)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(beneficiary.id)}
                    >
                      Delete
                    </button>
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