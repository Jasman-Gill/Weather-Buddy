import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Save credentials to localStorage
        await axios.post('http://localhost:5000/login', {
            email,
            password
        })
            .then(response => {
                console.log(response);
                localStorage.setItem("user", JSON.stringify(response.data));
                alert("Login successful!");
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
                alert("Login failed. Please check your credentials.");
            });
        
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
        }}>
            <div style={{
                background: '#fff',
                padding: '2rem 2.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(102,166,255,0.15)',
                minWidth: '320px',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#66a6ff' }}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            fontSize: '1rem'
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginBottom: '1.5rem',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            fontSize: '1rem',
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(102,166,255,0.12)'
                        }}
                    >
                        Login
                    </button>
                </form>
                <p style={{ marginTop: '1rem' }}>
                    New user? <span style={{ color: '#66a6ff', cursor: 'pointer' }} onClick={() => navigate('/signup')}>Create an account</span>
                </p>
            </div>
        </div>
    );
}


export default Signin;