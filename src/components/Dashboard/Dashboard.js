import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../ScrumDetails/ScrumDetails';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrumName, setNewScrumName] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('To Do');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:3000/scrums')
            .then(response => setScrums(response.data));

        axios.get('http://localhost:3000/users')
            .then(response => setUsers(response.data));
    }, []);

    const handleGetDetails = (scrumId) => {
        axios.get(`http://localhost:3000/scrums/${scrumId}`)
            .then(response => setSelectedScrum(response.data));
    };

    const handleAddScrum = (event) => {
        event.preventDefault();

        axios.post('http://localhost:3000/scrums', { name: newScrumName })
            .then(newScrumResponse => {
                const newScrum = newScrumResponse.data;
                return axios.post('http://localhost:3000/tasks', {
                    title: newTaskTitle,
                    description: newTaskDescription,
                    status: newTaskStatus,
                    scrumId: newScrum.id,
                    assignedTo: Number(newTaskAssignedTo),
                    history: [
                        {
                            status: newTaskStatus,
                            date: new Date().toISOString().split('T')[0],
                        },
                    ],
                });
            })
            .then(() => axios.get('http://localhost:3000/scrums'))
            .then(updatedScrums => {
                setScrums(updatedScrums.data);
                setShowForm(false);
                setNewScrumName('');
                setNewTaskTitle('');
                setNewTaskDescription('');
                setNewTaskStatus('To Do');
                setNewTaskAssignedTo('');
            });
    };

    return (
        <div>
            <h2>Scrum Teams</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>
                    {showForm && (
                        <form onSubmit={handleAddScrum}>
                            <div>
                                <label>Scrum Name:</label>
                                <input type="text" value={newScrumName} onChange={(e) => setNewScrumName(e.target.value)} required />
                            </div>
                            <div>
                                <label>Task Title:</label>
                                <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label>Task Description:</label>
                                <input type="text" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} required />
                            </div>
                            <div>
                                <label>Task Status:</label>
                                <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)} required>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label>Assign To:</label>
                                <select value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} required>
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Create Scrum</button>
                        </form>
                    )}
                </div>
            )}
            <ul>
                {scrums.map((scrum) => (
                    <li key={scrum.id}>
                        {scrum.name}
                        <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                    </li>
                ))}
            </ul>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;