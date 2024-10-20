import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentDetails = () => {
    const { studentId } = useParams();
    const navigate = useNavigate(); // Hook for navigation
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/students/student_by_id?student_id=${studentId}`);
                if (response.data.status) {
                    setStudent(response.data.data);
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

    if (loading) return <div className="text-center"><p>Loading...</p></div>;
    if (error) return <div className="text-center text-danger"><p>{error}</p></div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="font-weight-bold">Student Details</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                >
                    Back
                </button>
            </div>
            {student && (
                <div className="card shadow-lg border-light rounded">
                    <div className="card-header bg-primary text-white">
                        <h3 style={{ fontFamily: 'Arial' }}>{student.name}</h3>
                    </div>
                    <div className="card-body">
                        <p className="h6"><strong>Age:</strong> {student.age}</p>
                        <p className="h6"><strong>Class:</strong> {student.class}</p>
                        <p className="h6"><strong>Parent Contact:</strong> {student.parent_contact}</p>
                        <h4 className="mt-4">Marks:</h4>
                        <ul className="list-group">
                            {student.marks_data.map(mark => (
                                <li key={mark._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{mark.subject}</span>
                                    <span className="badge bg-info text-dark rounded-pill">{mark.marks}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetails;
