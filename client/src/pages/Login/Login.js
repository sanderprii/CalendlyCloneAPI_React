// src/pages/Login/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { setToken } from '../../utils/authHelpers';

function Login({ onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values), // {email, password}
            });

            if (res.ok) {
                // Eeldame, et tagastatakse token (või mingi sarnane tunnus)
                const data = await res.json().catch(() => ({}));
                if (data.token) {
                    setToken(data.token);
                    onLoginSuccess();
                    message.success('Login successful');
                    navigate('/users');
                } else {
                    message.success('Login successful (no token returned?)');
                    onLoginSuccess();
                    navigate('/users');
                }
            } else {
                if (res.status === 401) {
                    message.error('Invalid credentials');
                } else {
                    message.error('Login failed');
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
            <h2>Login</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input email!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input password!' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Log in
                    </Button>
                    <div style={{ marginTop: 10 }}>
                        Pole kontot? <Link to="/register">Loo uus kasutaja</Link>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;
