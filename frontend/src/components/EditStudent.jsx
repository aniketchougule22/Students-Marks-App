import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditStudent = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '', show: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        class: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/students/student_by_id?student_id=${studentId}`);
                if (response.data.status) {
                    setStudent(response.data.data);
                    setFormData({
                        name: response.data.data.name,
                        age: response.data.data.age,
                        class: response.data.data.class
                    });
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError("Error fetching student details.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch('http://localhost:3001/students', {
                student_id: studentId,
                ...formData
            });
            if (response.data.status) {
                setAlert({ message: "Student updated successfully!", type: "success", show: true });
                setTimeout(() => { navigate('/') }, 2000);
            } else {
                setAlert({ message: "Failed to update student.", type: "danger", show: true });
            }
        } catch (err) {
            setAlert({ message: "Error updating student.", type: "danger", show: true });
        }
    };

    if (loading) return <div className="text-center"><p>Loading...</p></div>;
    if (error) return <div className="text-center text-danger"><p>{error}</p></div>;

    return (
        <div className="container-sm mt-5">
            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="close" onClick={() => setAlert({ ...alert, show: false })}>
                        <span>&times;</span>
                    </button>
                </div>
            )}
            <h2 className="text-center mb-4 font-weight-bold">Edit Student</h2>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                <div className="form-group mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Age</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Class</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="class" 
                        value={formData.class} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Update Student</button>
                <button type="button" className="btn btn-danger ms-2" onClick={()=>navigate('/')}>
                Cancel
              </button>
            </form>
        </div>
    );
};

export default EditStudent;
