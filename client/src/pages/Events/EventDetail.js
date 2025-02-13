// src/pages/Events/EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Button, message } from 'antd';
import { getAuthHeaders } from '../../utils/authHelpers';

function EventDetail() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const [form] = Form.useForm();

    const fetchEvent = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setEventData(data);
                form.setFieldsValue(data);
            } else if (res.status === 404) {
                message.error('Event not found');
            } else {
                message.error('Failed to fetch event');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    const handleUpdate = async (values) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(values)
            });
            if (res.ok) {
                const updated = await res.json();
                setEventData(updated);
                form.setFieldsValue(updated);
                message.success('Event updated');
            } else {
                message.error('Event update failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                message.success('Event deleted');
                navigate('/events');
            } else {
                message.error('Delete failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    useEffect(() => {
        fetchEvent();
        // eslint-disable-next-line
    }, [eventId]);

    if (!eventData) {
        return <div>Loading event...</div>;
    }

    return (
        <Card title="Event Detail" style={{ maxWidth: 600, margin: '20px auto' }}>
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>
                <Form.Item name="duration" label="Duration">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input />
                </Form.Item>
                <Form.Item name="color" label="Color">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
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

export default EventDetail;
