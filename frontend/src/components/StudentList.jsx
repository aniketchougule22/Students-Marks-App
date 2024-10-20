import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const recordsPerPage = 5;
    const [showModal, setShowModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [alert, setAlert] = useState({ message: "", type: "", show: false });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/students?page=${currentPage}&limit=${recordsPerPage}`);
                setStudents(response.data.data.get);
                setTotalPages(Math.ceil(response.data.data.total_number_of_records / recordsPerPage));
            } catch (error) {
                console.error('There was an error fetching students!', error);
            }
        };

        fetchStudents();
    }, [currentPage]);

    const handleAddStudentClick = () => {
        navigate('/add-student');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditStudent = (studentId, event) => {
        event.stopPropagation(); // Prevent row click event
        navigate(`/edit-student/${studentId}`); // Navigate to EditStudent component
    };

    const handleDeleteStudent = async () => {
        if (studentToDelete) {
            try {
                const response = await axios.delete(`http://localhost:3001/students?student_id=${studentToDelete}`);
                if (response.data.status) {
                    setStudents(students.filter(student => student._id !== studentToDelete));
                    setAlert({ message: response.data.message, type: "success", show: true });
                }
            } catch (error) {
                setAlert({ message: "Error deleting the student. Please try again.", type: "danger", show: true });
            } finally {
                setShowModal(false);
                setStudentToDelete(null);
            }
        }
    };

    const handleViewDetails = (studentId) => {
        navigate(`/student-details/${studentId}`);
    };

    const openModal = (studentId) => {
        setStudentToDelete(studentId);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4 letter-space">Students List</h3>
            <button className="btn btn-primary mb-3" onClick={handleAddStudentClick}>
                Add Student
            </button>
            <table className="table table-striped table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className='text-center'>Sr No</th>
                        <th scope="col" className='text-center'>Name</th>
                        <th scope="col" className='text-center'>Age</th>
                        <th scope="col" className='text-center'>Class</th>
                        <th scope="col" className='text-center'>Parent Contact</th>
                        <th scope="col" className='text-center'>Edit</th>
                        <th scope="col" className='text-center'>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <tr key={student._id} onClick={() => handleViewDetails(student._id)} style={{ cursor: 'pointer' }}>
                                <th scope="row" className='text-center'>{(currentPage - 1) * recordsPerPage + index + 1}</th>
                                <td className='text-center'>{student.name}</td>
                                <td className='text-center'>{student.age}</td>
                                <td className='text-center'>{student.class}</td>
                                <td className='text-center'>{student.parent_contact}</td>

                                <td className='d-flex justify-content-center align-items-center'>
                                    <button 
                                        className="btn btn-outline-primary d-flex align-items-center"
                                        onClick={(event) => handleEditStudent(student._id, event)}
                                    >
                                        <FaEdit /> 
                                    </button>
                                </td>

                                <td className='text-center'>
                                    <button
                                        className="btn btn-outline-danger d-flex align-items-center"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openModal(student._id);
                                        }}
                                    >
                                        <FaTrash className="text-danger" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button type="button" className="btn btn-link" onClick={() => setShowModal(false)} aria-label="Close">
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this student?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteStudent}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <nav className='fixed-pagination'>
                <ul className="pagination justify-content-end mt-3">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo; Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next &raquo;</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default StudentList;
