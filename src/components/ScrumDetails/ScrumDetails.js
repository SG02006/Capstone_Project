import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

const ScrumDetails = ({ scrum }) => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        const checkUser = () => {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (!loggedInUser) {
                history.push('/login');
            }
        };

        checkUser();
    }, [history]);

    useEffect(() => {
        axios.get(`http://localhost:3000/tasks?scrumId=${scrum.id}`)
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, [scrum.id]);

    useEffect(() => {
        if (tasks.length > 0) {
            axios.get('http://localhost:3000/users')
                .then(response => {
                    const scrumUsers = response.data.filter(user => tasks.some(task => task.assignedTo == user.id));
                    setUsers(scrumUsers);
                    console.log("user",users)
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [tasks]);

    const handleStatusChange = (taskId, newStatus) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (!taskToUpdate) return;

        axios.patch(`http://localhost:3000/tasks/${taskId}`,{
            status: newStatus,
            history: [
                ...taskToUpdate.history,
                {
                    status: newStatus,
                    date: new Date().toISOString().split('T')[0],
                },
            ],
        })
            .then(() => {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, status: newStatus } : task
                    )
                );
            })
            .catch(error => {
                console.error('Error updating task status:', error);
            });
    };

    return (
        <div>
            <h3>Scrum Details for {scrum.name}</h3>
            <h4>Tasks</h4>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}:</strong> {task.description} - <em>{task.status}</em>
                        {user?.role === 'admin' && (
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        )}
                    </li>
                ))}
            </ul>
            <h4>Users</h4>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScrumDetails;