// src/components/AddStudentForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddStudentForm = ({ onClose }) => {
    const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: '',
    age: '',
    class: '',
    parent_contact: '',
    student_marks: [{ subject: '', marks: '' }],
  });

  const [alert, setAlert] = useState({ message: '', type: '', show: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleMarkChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMarks = [...studentData.student_marks];
    updatedMarks[index][name] = value;
    setStudentData({ ...studentData, student_marks: updatedMarks });
  };

  const addMarkField = () => {
    setStudentData({
      ...studentData,
      student_marks: [...studentData.student_marks, { subject: '', marks: '' }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3001/students`, studentData)
      .then((response) => {
        if (response.data.status) {
            setAlert({ message: "Student added successfully!", type: "success", show: true });
            navigate('/');
        } else {
            setAlert({ message: "Failed to add student.", type: "danger", show: true });
        }
      })
      .catch((error) => {
        console.error('Error adding student:', error);
        setAlert({ message: "There was an error adding the student.", type: "danger", show: true });
      });
  };

  return (
    <div className="container mt-4">
    {alert.show && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      <div className="card shadow" style={{ maxWidth: '850px', margin: 'auto' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Add New Student</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                required
                placeholder="Enter student name"
              />
            </div>
            <div className="form-group mb-2">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={studentData.age}
                onChange={handleChange}
                required
                placeholder="Enter student age"
              />
            </div>
            <div className="form-group mb-2">
              <label>Class</label>
              <input
                type="text"
                className="form-control"
                name="class"
                value={studentData.class}
                onChange={handleChange}
                required
                placeholder="Enter student class"
              />
            </div>
            <div className="form-group mb-2">
              <label>Parent Contact</label>
              <input
                type="text"
                className="form-control"
                name="parent_contact"
                value={studentData.parent_contact}
                onChange={handleChange}
                required
                placeholder="Enter parent contact number"
              />
            </div>

            <h5 className="mt-4">Marks</h5>
            {studentData.student_marks.map((mark, index) => (
              <div key={index} className="form-row mb-4">
                <div className="form-group col-md-6">
                  <label>Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={mark.subject}
                    onChange={(e) => handleMarkChange(index, e)}
                    required
                    placeholder="Enter subject name"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Marks</label>
                  <input
                    type="number"
                    className="form-control"
                    name="marks"
                    value={mark.marks}
                    onChange={(e) => handleMarkChange(index, e)}
                    required
                    placeholder="Enter marks"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={addMarkField}
            >
              Add More Marks
            </button>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-danger ms-2" onClick={()=>navigate('/')}>
                Cancel
              </button>
            </div>
            <div className="mb-3" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentForm;
