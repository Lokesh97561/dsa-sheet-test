import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [topics, setTopics] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    useEffect(() => {
        if (token) {
            fetchTopics();
        }
    }, [token]);

    const fetchTopics = async () => {
        try {
            const response = await axios.get('http://localhost:5000/topics', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            alert('Login successful!');
        } catch (error) {
            alert('Login failed!');
        }
    };

    const handleCheckboxChange = async (subtopicId) => {
        try {
            await axios.patch(`http://localhost:5000/subtopics/${subtopicId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTopics(); // Refresh topics to update state
        } catch (error) {
            alert('Failed to update progress!');
        }
    };
    const getCheckboxValue = async (subtopicId) => {
        try {
             return await axios.get(`http://localhost:5000/checkbox/${subtopicId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
           // console.log("value==", value);
            //fetchTopics(); // Refresh topics to update state
        } catch (error) {
            alert('Failed to update progress!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setTopics([]);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>DSA Sheet</h1>
                {token ? (
                    <div>
                        <button onClick={handleLogout}>Logout</button>
                        <h2>Topics</h2>
                        <ul>
                            {topics.map(topic => (
                                <li key={topic._id}>
                                    <h3>{topic.name} ({topic.level})</h3>
                                    <p>{topic.description}</p>
                                    <ul>
                                        {topic.subTopics && topic.subTopics.map(subtopic => (
                                            <li key={subtopic._id}>
                                                {subtopic.name}

                                                <div>
                                                    {/* Safe access for links */}
                                                    <a href={subtopic.youtubeLinks?.[0] || '#'} target="_blank" rel="noopener noreferrer">YouTube</a> |
                                                    <a href={subtopic.leetcodeLinks?.[0] || '#'} target="_blank" rel="noopener noreferrer">LeetCode</a> |
                                                    <a href={subtopic.articleLinks?.[0] || '#'} target="_blank" rel="noopener noreferrer">Article</a>
                                                    <div>{subtopic.isCompleted}</div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={subtopic.isCompleted}
                                                    onChange={() => handleCheckboxChange(subtopic._id)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div>
                        <h2>Login</h2>
                        <input type="email" placeholder="Email" id="email" />
                        <input type="password" placeholder="Password" id="password" />
                        <button onClick={() => handleLogin(
                            document.getElementById('email').value,
                            document.getElementById('password').value
                        )}>Login</button>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
