// src/pages/Schedules/Schedules.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { getAuthHeaders } from '../../utils/authHelpers';

/**
 * NB! availability sisestamisel kasutame lihtsat JSON teksti,
 * reaalses elus oleks mugavam see lahendada detailsema UI-ga.
 */
function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/schedules`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setSchedules(data);
            } else {
                message.error('Failed to fetch schedules');
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
            // Eeldame, et availability on JSON formaadis tekst
            let parsedAvailability;
            try {
                parsedAvailability = JSON.parse(values.availability);
            } catch (err) {
                message.error('Availability field must be valid JSON');
                return;
            }

            const body = {
                userId: values.userId,
                availability: parsedAvailability
            };

            const res = await fetch(`${process.env.REACT_APP_API_URL}/schedules`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });
            if (res.ok) {
                message.success('Schedule created');
                setCreateModalVisible(false);
                form.resetFields();
                fetchSchedules();
            } else {
                message.error('Create schedule failed');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => <Link to={`/schedules/${record.userId}`}>{text}</Link>
        },
        {
            title: 'UserId',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: 'Availability',
            dataIndex: 'availability',
            key: 'availability',
            render: (val) => JSON.stringify(val)
        }
    ];

    return (
        <div>
            <h2>Schedules</h2>
            <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                Create Schedule
            </Button>
            <Table dataSource={schedules} columns={columns} loading={loading} rowKey="id" />

            <Modal
                title="Create Schedule"
                visible={createModalVisible}
                onOk={handleCreate}
                onCancel={() => setCreateModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="availability"
                        label="Availability (JSON)"
                        rules={[{ required: true, message: 'Please input availability in JSON format!' }]}
                    >
                        <Input.TextArea rows={4} placeholder='[{"day":"monday","startTime":"09:00","endTime":"17:00"}]' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Schedules;
