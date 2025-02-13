// src/pages/Events/Events.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { Link } from 'react-router-dom';
import { getAuthHeaders } from '../../utils/authHelpers';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/events`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            } else {
                message.error('Failed to fetch events');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const res = await fetch(`${process.env.REACT_APP_API_URL}/events`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(values),
            });
            if (res.ok) {
                await res.json();
                message.success('Event created');
                setCreateModalVisible(false);
                form.resetFields();
                fetchEvents();
            } else {
                message.error('Create event failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => <Link to={`/events/${record.id}`}>{text}</Link>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration'
        }
    ];

    return (
        <div>
            <h2>Events</h2>
            <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                Create Event
            </Button>
            <Table
                dataSource={events}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title="Create Event"
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onOk={handleCreate}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>
                    <Form.Item name="color" label="Color">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Events;
