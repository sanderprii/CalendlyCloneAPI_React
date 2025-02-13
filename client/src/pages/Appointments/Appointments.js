// src/pages/Appointments/Appointments.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message } from 'antd';
import { Link } from 'react-router-dom';
import { getAuthHeaders } from '../../utils/authHelpers';
import moment from 'moment';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            } else {
                message.error('Failed to fetch appointments');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const body = {
                eventId: values.eventId,
                userId: values.userId,
                inviteeEmail: values.inviteeEmail,
                startTime: values.startTime.format(),
                endTime: values.endTime.format()
            };
            const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });
            if (res.ok) {
                message.success('Appointment created');
                setCreateModalVisible(false);
                form.resetFields();
                fetchAppointments();
            } else {
                message.error('Create failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => <Link to={`/appointments/${record.id}`}>{text}</Link>
        },
        {
            title: 'EventId',
            dataIndex: 'eventId',
            key: 'eventId'
        },
        {
            title: 'UserId',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: 'InviteeEmail',
            dataIndex: 'inviteeEmail',
            key: 'inviteeEmail'
        },
        {
            title: 'StartTime',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (time) => moment(time).format('YYYY-MM-DD HH:mm')
        },
        {
            title: 'EndTime',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (time) => (time ? moment(time).format('YYYY-MM-DD HH:mm') : '-')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        }
    ];

    return (
        <div>
            <h2>Appointments</h2>
            <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                Create Appointment
            </Button>
            <Table
                dataSource={appointments}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title="Create Appointment"
                visible={createModalVisible}
                onOk={handleCreate}
                onCancel={() => setCreateModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="eventId" label="Event ID" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="inviteeEmail" label="Invitee Email" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="endTime" label="End Time">
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Appointments;
