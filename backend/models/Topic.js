const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
    name: String,
    problemLinks: [String],
    youtubeLinks: [String],
    leetcodeLinks: [String],
    articleLinks: [String],
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
});

const topicSchema = new mongoose.Schema({
    name: String,
    description: String,
    level: { type: String, enum: ['Easy', 'Medium', 'Tough'], required: true },
    youtubeLinks: [String],
    leetcodeLinks: [String],
    articleLinks: [String],
    subTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subtopic' }],
});

module.exports = {
    Topic: mongoose.model('Topic', topicSchema),
    Subtopic: mongoose.model('Subtopic', subtopicSchema),
};
