const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');
//const subTopicRoutes = require('./routes/subtopicRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection failed:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/topics', topicRoutes);
app.use('/', topicRoutes);
// PATCH: Mark Subtopic as Completed
app.patch('/subtopics/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        const { id: subtopicId } = req.params;

        if (!user.completedSubtopics.includes(subtopicId)) {
            user.completedSubtopics.push(subtopicId);
        } else {
            user.completedSubtopics = user.completedSubtopics.filter(id => id.toString() !== subtopicId);
        }

        await user.save();
        res.send(user.completedSubtopics);
    } catch (error) {
        res.status(400).send('Error updating subtopic progress');
    }
});

// GET: Topics with Completion Status
app.get('/topics', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        const topics = await Topic.find().populate('subTopics');

        // Add isCompleted status for each subtopic
        const enrichedTopics = topics.map(topic => ({
            ...topic.toObject(),
            subTopics: topic.subTopics.map(subtopic => ({
                ...subtopic.toObject(),
                isCompleted: user.completedSubtopics.includes(subtopic._id.toString()),
            })),
        }));

        res.send(enrichedTopics);
    } catch (error) {
        res.status(400).send('Error fetching topics');
    }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
