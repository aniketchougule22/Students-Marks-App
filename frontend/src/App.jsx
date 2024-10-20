import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import StudentList from './components/StudentList';
import AddStudentForm from './components/AddStudentForm';
import StudentDetails from './components/StudentDetails';
import EditStudent from './components/EditStudent';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<StudentList/>} />
          <Route exact path='/add-student' element={<AddStudentForm/>} />
          <Route path="/student-details/:studentId" element={<StudentDetails />} />
          <Route path="/edit-student/:studentId" element={<EditStudent />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
