import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
        userType: '' 
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password, userType } = loginInfo;
        if (!email || !password || !userType) {
            return handleError('Email, password, and user type are required')
        }
        try {
            const url = `https://v-labs.vercel.app//auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error, userType: returnedUserType } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('userType', returnedUserType);
                setTimeout(() => {
                    if (returnedUserType === 'librarian') {
                        navigate('/librarian-dashboard');
                    } else {
                        navigate('/member-dashboard');
                    }
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className="user-type-selection">
                    <p>Login as:</p>
                    <div className="radio-group">
                        <div className="radio-option">
                            <input
                                type="radio"
                                id="member"
                                name="userType"
                                value="member"
                                checked={loginInfo.userType === 'member'}
                                onChange={handleChange}
                            />
                            <label htmlFor="member">Member</label>
                        </div>
                        <div className="radio-option">
                            <input
                                type="radio"
                                id="librarian"
                                name="userType"
                                value="librarian"
                                checked={loginInfo.userType === 'librarian'}
                                onChange={handleChange}
                            />
                            <label htmlFor="librarian">Librarian</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                <button type='submit'>Login</button>
                <span>Don't have an account?
                    <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login
