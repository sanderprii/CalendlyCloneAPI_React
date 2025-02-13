// src/pages/Schedules/ScheduleDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message } from 'antd';
import { getAuthHeaders } from '../../utils/authHelpers';

function ScheduleDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/schedules/${userId}`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setSchedule(data);
                form.setFieldsValue({
                    availability: JSON.stringify(data.availability, null, 2)
                });
            } else if (res.status === 404) {
                message.error('Schedule not found');
            } else {
                message.error('Failed to fetch schedule');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        let parsedAvailability;
        try {
            parsedAvailability = JSON.parse(values.availability);
        } catch (error) {
            message.error('Invalid JSON format');
            return;
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/schedules/${userId}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ availability: parsedAvailability }),
            });
            if (res.ok) {
                const updated = await res.json();
                setSchedule(updated);
                form.setFieldsValue({
                    availability: JSON.stringify(updated.availability, null, 2)
                });
                message.success('Schedule updated');
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/schedules/${userId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                message.success('Schedule deleted');
                navigate('/schedules');
            } else {
                message.error('Delete failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    useEffect(() => {
        fetchSchedule();
        // eslint-disable-next-line
    }, [userId]);

    if (!schedule) {
        return <div>Loading schedule...</div>;
    }

    return (
        <Card title="Schedule Detail" style={{ maxWidth: 600, margin: '20px auto' }}>
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item label="UserID">
                    <Input disabled value={schedule.userId} />
                </Form.Item>
                <Form.Item name="availability" label="Availability (JSON)">
                    <Input.TextArea rows={6} />
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

export default ScheduleDetail;
