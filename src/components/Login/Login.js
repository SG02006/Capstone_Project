import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const { login } = useContext(UserContext);

    const handleLogin = (e) => {
        e.preventDefault();

        axios.get(`http://localhost:3000/users?email=${email}&password=${password}`)
            .then(response => {
                if (response.data.length > 0) {
                    const user = response.data[0];
                    login(user);

                    history.push('/');
                } else {
                    alert('Invalid email or password');
                }
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Login</button>
            </form>
            <button onClick={() => history.push('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;