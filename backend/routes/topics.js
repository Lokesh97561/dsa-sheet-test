const express = require('express');
const { Topic, Subtopic } = require('../models/Topic');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all topics
// router.get('/', auth, async (req, res) => {
//     let topics = await Topic.find().populate('subTopics');
//     const user = await User.findById(req.user._id);
//     await topics.forEach(topic => {
//         if (topic.subTopics && Array.isArray(topic.subTopics)) {
//              topic.subTopics.forEach(subTopic => {
//                 subTopic.isCompleted = true; // Add the new key "isCompleted" to each subTopic
//             });
//         }
//         console.log("topic==>>", JSON.stringify(topic))
//     });
//
//     console.log("data==>>>", JSON.stringify(topics));
//     res.send(topics);
// });
router.get('/', auth, async (req, res) => {
    try {
        let topics = await Topic.find().populate('subTopics');
        const user = await User.findById(req.user._id);

        // Modify the `isCompleted` property for all subTopics
        const modifiedTopics = topics.map(topic => {
            const modifiedSubTopics = topic.subTopics.map(subTopic => ({
                ...subTopic.toObject(), // Convert Mongoose Document to a plain object
                isCompleted: user.completedSubtopics.includes(subTopic._id)     // Add the new property
            }));

            return {
                ...topic.toObject(),     // Convert Topic to a plain object
                subTopics: modifiedSubTopics // Replace subTopics with modified ones
            };
        });

        console.log("Modified topics:", JSON.stringify(modifiedTopics, null, 2));

        // Send the modified response
        res.send(modifiedTopics);


    } catch (error) {
        console.error("Error in fetching or modifying topics:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Create new topic
router.post('/', auth, async (req, res) => {
    const newTopic = new Topic(req.body);
    await newTopic.save();
    res.status(201).send('Topic created');
});

//create new subtopics
router.post('/subtopics', auth, async (req, res) => {
    const { topicId } = req.params;
    const { name, problemLinks, youtubeLinks, articleLinks, topic} = req.body;
    try {
        const subtopic = new Subtopic(req.body);
        await subtopic.save();
        await Topic.findByIdAndUpdate(topic, { $push: { subTopics: subtopic } });
        res.status(201).json({ message: 'Subtopic added', subtopic });
    } catch (error) {
        res.status(400).json({ error: 'Error adding subtopic' });
    }
});

// Mark subtopic as completed
router.patch('/subtopics/:id', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user.completedSubtopics.includes(req.params.id)) {
        user.completedSubtopics.push(req.params.id);
        await user.save();
    }
    res.send('Subtopic completed');

});
// check checkbox value
router.get('/checkbox/:id', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    console.log("data==>>>", user.completedSubtopics.includes(req.params.id));
    res.send(user.completedSubtopics.includes(req.params.id));
});

module.exports = router;
