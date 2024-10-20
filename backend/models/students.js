const mongoose = require('mongoose');

let studentsSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    class: { 
        type: String, 
        required: true 
    },

    parent_contact: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },

    created_at: {
        type: Date,
        default: new Date()
    }
});

let students = mongoose.model('students', studentsSchema);

const insertOne = async (body) => {
    try {
        return await new students(body).save();
    } catch (error) {
        return error;
    }
};

const find = async (query) => {
    try {
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 5;
        let search_text = query.search_text || '';
        const startIndex = (page - 1) * limit;
        const get = await students.find({
              'name': {'$regex': search_text && search_text != null  ? search_text : '', '$options': 'i'}
          }).skip(startIndex).limit(limit).sort({ _id: -1 }).exec();
        const total_number_of_records = await students.countDocuments();
        let number_of_records = get.length;
        return { total_number_of_records, number_of_records, page, get };
    } catch (error) {
        return error;
    }
};

const findOne = async (query) => {
    try {
        return await students.findOne(query);
    } catch (error) {
        return error;
    }
};

const getStudentDetailsWithMarks = async (query) => {
    try {
        return await students.aggregate([
            {
              '$match': {
                '_id': new mongoose.Types.ObjectId(query.student_id)
              }
            }, {
              '$lookup': {
                'from': 'marks', 
                'localField': '_id', 
                'foreignField': 'studentId', 
                'pipeline': [
                  {
                    '$project': {
                      'subject': 1, 
                      'marks': 1
                    }
                  }
                ], 
                'as': 'marks_data'
              }
            }
          ]);
    } catch (error) {
        return error;
    }
};

const updateOne = async (match, body) => {
    try {
        return await students.findOneAndUpdate(match, body, { new: true });
    } catch (error) {
        return error;
    }
};

const deleteOne = async (match) => {
    try {
        return await students.findOneAndDelete(match);
    } catch (error) {
        return error;
    }
};

module.exports = {
    insertOne,
    find,
    findOne,
    getStudentDetailsWithMarks,
    updateOne,
    deleteOne
}