// src/pages/Register/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

/**
 * Selles komponendis POST-itame /users endpoint’i,
 * et luua uus kasutaja (registreerimine).
 */
function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }
            );

            if (response.ok) {
                // Kas õnnestus?
                const userData = await response.json().catch(() => ({}));
                message.success('Kasutaja loodud! Logi nüüd sisse.');
                // Kui edukalt registreeritud, suuname login-lehele:
                navigate('/login');
            } else {
                // Kui serverist tuli viga
                const errorData = await response.json().catch(() => ({}));
                if (errorData?.message) {
                    message.error(errorData.message);
                } else {
                    message.error('Registreerimine ebaõnnestus');
                }
            }

        } catch (err) {
            console.error(err);
            message.error('Serveri viga');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
            <h2>Registreeri uus kasutaja</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Nimi"
                    rules={[{ required: true, message: 'Palun sisesta nimi' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Palun sisesta email' },
                        { type: 'email', message: 'Sisesta korrektne email' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Parool"
                    rules={[{ required: true, message: 'Palun sisesta parool' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="timezone"
                    label="Ajavöönd (valikuline)"
                >
                    <Input placeholder="Europe/Tallinn vms" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Registreeri
                    </Button>
                    <div style={{ marginTop: 10 }}>
                        Juba kasutaja olemas? <Link to="/login">Logi sisse</Link>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;
