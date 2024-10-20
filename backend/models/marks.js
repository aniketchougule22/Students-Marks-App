const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    subject: { 
        type: String, 
        required: true 
    },

    marks: { 
        type: Number, 
        required: true 
    },

    created_at: {
        type: Date,
        default: new Date()
    }
});

let marks = mongoose.model('marks', marksSchema);


const insertOne = async (body) => {
    try {
        return await new marks(body).save();
    } catch (error) {
        return error;
    }
};

const insertMany = async (body) => {
    try {
        return await marks.insertMany(body);
    } catch (error) {
        return error;
    }
};

const findOne = async (query) => {
    try {
        return await marks.findOne(query);
    } catch (error) {
        return error;
    }
};

const updateOne = async (match, query) => {
    try {
        return await marks.findByIdAndUpdate(match, query);
    } catch (error) {
        return error;
    }
};

const deleteOne = async (match) => {
    try {
        return await marks.findByIdAndDelete(match);
    } catch (error) {
        return error;
    }
};

const deleteMany = async (match) => {
    try {
        return await marks.deleteMany(match);
    } catch (error) {
        return error;
    }
};

module.exports = {
    insertOne,
    insertMany,
    findOne,
    updateOne,
    deleteOne,
    deleteMany
};
