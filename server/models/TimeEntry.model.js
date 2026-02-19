const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    billable: {
        type: Boolean,
        default: true
    },
    invoiced: {
        type: Boolean,
        default: false
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Calculate duration and amount before saving
timeEntrySchema.pre('save', function (next) {
    if (this.startTime && this.endTime) {
        this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // minutes
        this.amount = (this.duration / 60) * this.hourlyRate;
    }
    next();
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
