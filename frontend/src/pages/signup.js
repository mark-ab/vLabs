import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        userType: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, userType } = signupInfo;
        if (!name || !email || !password || !userType) {
            return handleError('Please fill all fields and select a user type')
        }
        try {
            const url = `https://v-labs.vercel.app/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
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
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div className="user-type-selection">
                    <p>I want to sign up as:</p>
                    <div className="radio-group">
                        <div className="radio-option">
                            <input
                                type="radio"
                                id="member"
                                name="userType"
                                value="member"
                                checked={signupInfo.userType === 'member'}
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
                                checked={signupInfo.userType === 'librarian'}
                                onChange={handleChange}
                            />
                            <label htmlFor="librarian">Librarian</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                    />
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                    />
                </div>
                <button type='submit'>Signup</button>
                <span>Already have an account ?
                    <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Signup
