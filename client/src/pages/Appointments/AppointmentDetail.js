// src/pages/Appointments/AppointmentDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, DatePicker, Button, message, Select } from 'antd';
import moment from 'moment';

import { getAuthHeaders } from '../../utils/authHelpers';

const { Option } = Select;

function AppointmentDetail() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [appointment, setAppointment] = useState(null);

    const fetchAppointment = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${appointmentId}`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setAppointment(data);
                form.setFieldsValue({
                    eventId: data.eventId,
                    userId: data.userId,
                    inviteeEmail: data.inviteeEmail,
                    startTime: data.startTime ? moment(data.startTime) : null,
                    endTime: data.endTime ? moment(data.endTime) : null,
                    status: data.status
                });
            } else if (res.status === 404) {
                message.error('Appointment not found');
            } else {
                message.error('Failed to fetch appointment');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    const handleUpdate = async (values) => {
        const body = {
            ...values,
            startTime: values.startTime ? values.startTime.format() : null,
            endTime: values.endTime ? values.endTime.format() : null
        };
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(body),
            });
            if (res.ok) {
                const updated = await res.json();
                setAppointment(updated);
                form.setFieldsValue({
                    eventId: updated.eventId,
                    userId: updated.userId,
                    inviteeEmail: updated.inviteeEmail,
                    startTime: updated.startTime ? moment(updated.startTime) : null,
                    endTime: updated.endTime ? moment(updated.endTime) : null,
                    status: updated.status
                });
                message.success('Appointment updated');
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                message.success('Appointment deleted');
                navigate('/appointments');
            } else {
                message.error('Delete failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    useEffect(() => {
        fetchAppointment();
        // eslint-disable-next-line
    }, [appointmentId]);

    if (!appointment) {
        return <div>Loading appointment...</div>;
    }

    return (
        <Card title="Appointment Detail" style={{ maxWidth: 600, margin: '20px auto' }}>
            <Form layout="vertical" form={form} onFinish={handleUpdate}>
                <Form.Item label="Event ID" name="eventId">
                    <Input />
                </Form.Item>
                <Form.Item label="User ID" name="userId">
                    <Input />
                </Form.Item>
                <Form.Item label="Invitee Email" name="inviteeEmail">
                    <Input />
                </Form.Item>
                <Form.Item label="Start Time" name="startTime">
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="End Time" name="endTime">
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Status" name="status">
                    <Select>
                        <Option value="scheduled">scheduled</Option>
                        <Option value="canceled">canceled</Option>
                        <Option value="completed">completed</Option>
                    </Select>
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

export default AppointmentDetail;
