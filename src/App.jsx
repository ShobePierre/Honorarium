import { useState, useEffect } from "react";
import {
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} from "./services/beneficiary";
import "./styles/App.css";

function App() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Step control for create flow (details -> schedule)
  const [createStep, setCreateStep] = useState("details");

  const facilityOptions = ["Computer Science", "Information Technology"];

  const rankOptions = [
    "Instructor 1",
    "Instructor 2",
    "Instructor 3",
    "Assistant Professor 1",
    "Assistant Professor 2",
    "Assistant Professor 3",
    "Assistant Professor 4",
    "Assistant Professor 5",
  ];

  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const [rateOptions, setRateOptions] = useState([]);

  // Create form state
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    employee_no: "",
    rank: "",
    subject_code: "",
    course_section: "",
    day: "",
    // formatted time range is stored in `time`, while
    // `start_time` and `end_time` are used for the UI controls
    time: "",
    start_time: "",
    end_time: "",
    nature: "",
    rate_per_hour: "",
    hours_per_day: "",
    start_date: "",
    end_date: "",
    holidays: [],
    newHolidayDate: "",
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
    start_time: "",
    end_time: "",
    nature: "",
    rate_per_hour: "",
    hours_per_day: "",
    start_date: "",
    end_date: "",
    holidays: [],
    newHolidayDate: "",
  });

  // Fetch beneficiaries on mount
  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const formatDisplayDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    }
    return value;
  };

  const formatTimeRange = (start, end) => {
    const formatPart = (value) => {
      if (!value) return "";
      const [hourStr, minute] = value.split(":");
      const parsedHour = parseInt(hourStr, 10);
      if (isNaN(parsedHour)) return value;
      let hour = parsedHour;
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return `${hour}:${minute}${ampm.toLowerCase()}`;
    };

    const startFormatted = formatPart(start);
    const endFormatted = formatPart(end);

    if (!startFormatted && !endFormatted) return null;
    if (startFormatted && endFormatted) return `${startFormatted} - ${endFormatted}`;
    return startFormatted || endFormatted;
  };

  const serializeHolidays = (holidays) => {
    if (!holidays || holidays.length === 0) return null;
    return holidays.join(",");
  };

  const parseTimeRange = (range) => {
    if (!range) return { start: "", end: "" };
    const parts = range.split("-").map((p) => p.trim());
    const parsePart = (value) => {
      if (!value) return "";
      const match = value.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
      if (!match) return "";
      let hour = parseInt(match[1], 10);
      const minute = match[2];
      const suffix = match[3]?.toLowerCase();
      if (suffix === "pm" && hour < 12) hour += 12;
      if (suffix === "am" && hour === 12) hour = 0;
      const hourStr = hour.toString().padStart(2, "0");
      return `${hourStr}:${minute}`;
    };
    return {
      start: parsePart(parts[0] || ""),
      end: parsePart(parts[1] || ""),
    };
  };

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
        time: formatTimeRange(formData.start_time, formData.end_time),
        nature: formData.nature && formData.nature.trim() ? formData.nature : null,
        rate_per_hour: formData.rate_per_hour && formData.rate_per_hour.trim() ? parseFloat(formData.rate_per_hour) : null,
        hours_per_day: formData.hours_per_day && formData.hours_per_day.trim() ? parseFloat(formData.hours_per_day) : null,
        start_date: formData.start_date && formData.start_date.trim() ? formData.start_date : null,
        end_date: formData.end_date && formData.end_date.trim() ? formData.end_date : null,
        holiday: serializeHolidays(formData.holidays),
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
        start_time: "",
        end_time: "",
        nature: "",
        rate_per_hour: "",
        hours_per_day: "",
        start_date: "",
        end_date: "",
        holidays: [],
        newHolidayDate: "",
      });
      setCreateStep("details");
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
        time: formatTimeRange(editFormData.start_time, editFormData.end_time),
        nature: editFormData.nature && editFormData.nature.trim() ? editFormData.nature : null,
        rate_per_hour: editFormData.rate_per_hour && editFormData.rate_per_hour.trim() ? parseFloat(editFormData.rate_per_hour) : null,
        hours_per_day: editFormData.hours_per_day && editFormData.hours_per_day.trim() ? parseFloat(editFormData.hours_per_day) : null,
        start_date: editFormData.start_date && editFormData.start_date.trim() ? editFormData.start_date : null,
        end_date: editFormData.end_date && editFormData.end_date.trim() ? editFormData.end_date : null,
        holiday: serializeHolidays(editFormData.holidays),
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
    const parsedTime = parseTimeRange(beneficiary.time || "");
    // Handle holidays: convert from API format to array
    let holidaysArray = [];
    if (beneficiary.holiday) {
      if (Array.isArray(beneficiary.holiday)) {
        holidaysArray = beneficiary.holiday;
      } else if (typeof beneficiary.holiday === "string" && beneficiary.holiday.trim().length > 0) {
        // Parse comma-separated string back to array
        holidaysArray = beneficiary.holiday.split(",").map((h) => h.trim()).filter((h) => h.length > 0);
      }
    }
    setEditFormData({
      name: beneficiary.name || "",
      facility: beneficiary.facility || "",
      employee_no: beneficiary.employee_no || "",
      rank: beneficiary.rank || "",
      subject_code: beneficiary.subject_code || "",
      course_section: beneficiary.course_section || "",
      day: beneficiary.day || "",
      time: beneficiary.time || "",
      start_time: parsedTime.start,
      end_time: parsedTime.end,
      nature: beneficiary.nature || "",
      rate_per_hour: beneficiary.rate_per_hour ? String(beneficiary.rate_per_hour) : "",
      hours_per_day: beneficiary.hours_per_day ? String(beneficiary.hours_per_day) : "",
      start_date: beneficiary.start_date || "",
      end_date: beneficiary.end_date || "",
      holidays: holidaysArray,
      newHolidayDate: "",
    });

    if (beneficiary.rate_per_hour) {
      const rateStr = String(beneficiary.rate_per_hour);
      setRateOptions((prev) =>
        prev.includes(rateStr) ? prev : [...prev, rateStr]
      );
    }
  };

  const handleGoToSchedule = () => {
    if (!formData.name.trim()) {
      setError("Please enter a name before setting the schedule");
      return;
    }
    setError(null);
    setCreateStep("schedule");
  };

  const handleBackToDetails = () => {
    setCreateStep("details");
  };

  const handleAddRateOption = () => {
    const value = window.prompt("Enter new rate per hour:");
    if (!value) return;
    const numeric = parseFloat(value);
    if (isNaN(numeric) || numeric <= 0) {
      alert("Please enter a valid positive number for the rate.");
      return;
    }
    const rateStr = String(numeric);
    setRateOptions((prev) =>
      prev.includes(rateStr) ? prev : [...prev, rateStr]
    );
    setFormData((prev) => ({
      ...prev,
      rate_per_hour: rateStr,
    }));
  };

  const adjustHours = (delta) => {
    setFormData((prev) => {
      const current = parseFloat(prev.hours_per_day || "0") || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        hours_per_day: String(next),
      };
    });
  };

  const adjustEditHours = (delta) => {
    setEditFormData((prev) => {
      const current = parseFloat(prev.hours_per_day || "0") || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        hours_per_day: String(next),
      };
    });
  };

  const handleAddHoliday = (isEdit = false) => {
    const currentData = isEdit ? editFormData : formData;
    const setData = isEdit ? setEditFormData : setFormData;
    
    const newDate = currentData.newHolidayDate;
    if (!newDate) {
      setError("Please select a date");
      return;
    }
    
    if (currentData.holidays.includes(newDate)) {
      setError("This date is already added");
      return;
    }

    setError(null);
    setData((prev) => ({
      ...prev,
      holidays: [...prev.holidays, newDate].sort(),
      newHolidayDate: "",
    }));
  };

  const handleRemoveHoliday = (date, isEdit = false) => {
    const setData = isEdit ? setEditFormData : setFormData;
    setData((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((h) => h !== date),
    }));
  };

  return (
    <div className="container">
      <h1>Honorarium Management System</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-layout">
        <div className="input-section">
        <h2>{createStep === "details" ? "Add New Beneficiary" : "Set Schedule"}</h2>

        {createStep === "details" ? (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter beneficiary name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Facility</label>
                <select
                  name="facility"
                  value={formData.facility}
                  onChange={handleFormChange}
                >
                  <option value="">Select Facility</option>
                  {facilityOptions.map((facility) => (
                    <option key={facility} value={facility}>
                      {facility}
                    </option>
                  ))}
                </select>
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
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleFormChange}
                >
                  <option value="">Select Rank</option>
                  {rankOptions.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
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
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleFormChange}
                >
                  <option value="">Select Day</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Time</label>
                <div className="field-with-button">
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleFormChange}
                  />
                  <span className="time-separator">to</span>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleFormChange}
                  />
                </div>
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
                <div className="field-with-button">
                  <select
                    name="rate_per_hour"
                    value={formData.rate_per_hour}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Rate</option>
                    {rateOptions.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleAddRateOption}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Hours per Day</label>
                <div className="field-with-button">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => adjustHours(-1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="hours_per_day"
                    step="1"
                    value={formData.hours_per_day}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => adjustHours(1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleGoToSchedule}
              disabled={loading}
              className="btn-primary"
            >
              Next: Set Schedule
            </button>
          </>
        ) : (
          <>
            <p style={{ marginBottom: "1rem", color: "#d1d5db" }}>
              Setting schedule for <strong>{formData.name}</strong>
            </p>
            <div className="form-grid">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Holidays (optional)</label>
                <div className="field-with-button">
                  <input
                    type="date"
                    value={formData.newHolidayDate}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      newHolidayDate: e.target.value,
                    }))}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleAddHoliday(false)}
                  >
                    Add
                  </button>
                </div>
                {formData.holidays.length > 0 && (
                  <div className="holidays-list">
                    {formData.holidays.map((holiday) => (
                      <div key={holiday} className="holiday-tag">
                        <span>{formatDisplayDate(holiday)}</span>
                        <button
                          type="button"
                          className="btn-remove-holiday"
                          onClick={() => handleRemoveHoliday(holiday, false)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="button-group">
              <button className="btn-cancel" onClick={handleBackToDetails}>
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Saving..." : "Save Beneficiary"}
              </button>
            </div>
          </>
        )}
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
                <select
                  name="facility"
                  value={editFormData.facility}
                  onChange={handleEditFormChange}
                >
                  <option value="">Select Facility</option>
                  {facilityOptions.map((facility) => (
                    <option key={facility} value={facility}>
                      {facility}
                    </option>
                  ))}
                </select>
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
                <select
                  name="rank"
                  value={editFormData.rank}
                  onChange={handleEditFormChange}
                >
                  <option value="">Select Rank</option>
                  {rankOptions.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
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
                <select
                  name="day"
                  value={editFormData.day}
                  onChange={handleEditFormChange}
                >
                  <option value="">Select Day</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Time</label>
                <div className="field-with-button">
                  <input
                    type="time"
                    name="start_time"
                    value={editFormData.start_time}
                    onChange={handleEditFormChange}
                  />
                  <span className="time-separator">to</span>
                  <input
                    type="time"
                    name="end_time"
                    value={editFormData.end_time}
                    onChange={handleEditFormChange}
                  />
                </div>
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
                <div className="field-with-button">
                  <select
                    name="rate_per_hour"
                    value={editFormData.rate_per_hour}
                    onChange={handleEditFormChange}
                  >
                    <option value="">Select Rate</option>
                    {rateOptions.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleAddRateOption}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Hours per Day</label>
                <div className="field-with-button">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => adjustEditHours(-1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="hours_per_day"
                    step="1"
                    value={editFormData.hours_per_day}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => adjustEditHours(1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-section-divider">
              <h4>Schedule & Availability</h4>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={editFormData.start_date}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={editFormData.end_date}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Holidays (optional)</label>
                <div className="field-with-button">
                  <input
                    type="date"
                    value={editFormData.newHolidayDate}
                    onChange={(e) => setEditFormData((prev) => ({
                      ...prev,
                      newHolidayDate: e.target.value,
                    }))}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleAddHoliday(true)}
                  >
                    Add
                  </button>
                </div>
                {editFormData.holidays.length > 0 && (
                  <div className="holidays-list">
                    {editFormData.holidays.map((holiday) => (
                      <div key={holiday} className="holiday-tag">
                        <span>{formatDisplayDate(holiday)}</span>
                        <button
                          type="button"
                          className="btn-remove-holiday"
                          onClick={() => handleRemoveHoliday(holiday, true)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                <th>Hours/Day</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Holiday</th>
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
                  <td>{beneficiary.hours_per_day || "-"}</td>
                  <td>{formatDisplayDate(beneficiary.start_date)}</td>
                  <td>{formatDisplayDate(beneficiary.end_date)}</td>
                  <td>
                    {beneficiary.holiday ? (
                      typeof beneficiary.holiday === "string" && beneficiary.holiday.includes(",") ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          {beneficiary.holiday.split(",").map((h) => {
                            const trimmed = h.trim();
                            return trimmed ? (
                              <span key={trimmed} style={{ fontSize: "0.85rem" }}>
                                {formatDisplayDate(trimmed)}
                              </span>
                            ) : null;
                          })}
                        </div>
                      ) : Array.isArray(beneficiary.holiday) ? (
                        beneficiary.holiday.length > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            {beneficiary.holiday.map((h) => (
                              <span key={h} style={{ fontSize: "0.85rem" }}>
                                {formatDisplayDate(h)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )
                      ) : (
                        formatDisplayDate(beneficiary.holiday)
                      )
                    ) : (
                      "-"
                    )}
                  </td>
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
    </div>
  );
}

export default App;