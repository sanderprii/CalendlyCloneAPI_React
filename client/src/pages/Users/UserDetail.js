// src/pages/Users/UserDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card } from 'antd';
import { getAuthHeaders } from '../../utils/authHelpers';

function UserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                form.setFieldsValue(data);
            } else if (res.status === 404) {
                message.error('User not found');
            } else {
                message.error('Failed to fetch user');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(values),
            });
            if (res.ok) {
                const updated = await res.json();
                setUser(updated);
                form.setFieldsValue(updated);
                message.success('User updated successfully');
            } else {
                message.error('Update failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                message.success('User deleted');
                navigate('/users');
            } else {
                message.error('Delete failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, [userId]);

    if (!user) {
        return <div>Loading user...</div>;
    }

    return (
        <Card title="User Detail" style={{ maxWidth: 600, margin: '20px auto' }}>
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password">
                    <Input.Password placeholder="Change password (optional)" />
                </Form.Item>
                <Form.Item name="timezone" label="Timezone">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        Update
                    </Button>
                    <Button danger onClick={handleDelete}>
                        Delete
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default UserDetail;
