const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const students = require('../../models/students');
const marks = require('../../models/marks');


/* Add Student */
router.post('/', async (req, res) => {
    try {
        const { name, age, class: className, student_marks, parent_contact } = req.body;
        const existingStudent = await students.findOne({ parent_contact });
        if (existingStudent) {
            return res.status(400).json({ status: false, statusCode: 400, message: "Duplicate key error: a student with this unique value already exists!" });
        }
        const student = await students.insertOne({ name, age, class: className, parent_contact });

        if (student_marks && student_marks.length > 0) {
            const marksData = student_marks.map((mark) => ({
                studentId: new mongoose.Types.ObjectId(student._id),
                subject: mark.subject,
                marks: mark.marks
            }));

            await marks.insertMany(marksData);
        }

        res.status(200).json({ status: true, statusCode: 200, message: "Student added successfully..!", data: student });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: false, statusCode: 400, message: "Duplicate key error: a student with this unique value already exists!", error: error.stack });
        }
        res.status(400).json({ status: false, statusCode: 400, message: "Something went wrong..!", error: error.stack });
    }
});

/* Get all Student */
router.get('/', async (req, res) => {
    try {
        const get = await students.find(req.query);
        if (get) {
            res.status(200).json({ status: true, statusCode: 200, message: "Students found..!", data: get });
        } else {
            res.status(200).json({ status: true, statusCode: 200, message: "No student available..!", data: get });
        }
    } catch (error) {
        res.status(400).json({ status: false, statusCode: 400, message: "something went wrong..!", error: error.stack });
    }
});


/* Get Student by _id */
router.get('/student_by_id', async (req, res) => {
    try { 
        const get = await students.getStudentDetailsWithMarks(req.query);
        if (get.length > 0) {
            res.status(200).json({ status: true, statusCode: 200, message: "Student found..!", data: get[0] });
        } else {
            res.status(400).json({ status: false, statusCode: 400, message: "Invalid student_id..!", data: {} });
        }
    } catch (error) {
        res.status(400).json({ status: false, statusCode: 400, message: "something went wrong..!", error: error.stack });
    }
});

/* Update Student */
router.patch('/', async (req, res) => {
    try {
        const update = await students.updateOne({ _id: new mongoose.Types.ObjectId(req.body.student_id) }, { $set: req.body });
        if (update != null) {
            res.status(200).json({ status: true, statusCode: 200, message: 'Student updated successfully..!', data: update });
        } else {
            res.status(400).json({ status: false, statusCode: 400, message: 'document not found..!' });
        }
    } catch (error) {
        res.status(400).json({ status: false, statusCode: 400, message: "something went wrong..!", error: error.stack });
    }
});

/* Delete Student */
router.delete('/', async (req, res) => {
    try {
        const { student_id } = req.query
        await marks.deleteMany({ studentId: new mongoose.Types.ObjectId(student_id) });
        const remove = await students.deleteOne({ _id: new mongoose.Types.ObjectId(student_id) });
        if (remove != null) {
            res.status(200).json({ status: true, statusCode: 200, message: 'Student deleted successfully..!' });
        } else {
            res.status(400).json({ status: false, statusCode: 400, message: 'document not found..!' });
        }
    } catch (error) {
        res.status(400).json({ status: false, statusCode: 400, message: "something went wrong..!", error: error.stack });
    }
});

module.exports = router;
