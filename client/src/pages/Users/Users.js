// src/pages/Users/Users.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { getAuthHeaders } from '../../utils/authHelpers';

function Users() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const [form] = Form.useForm();

    const fetchUsers = async (page, pageSize) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/users?page=${page}&pageSize=${pageSize}`,
                {
                    headers: getAuthHeaders(),
                }
            );
            if (res.ok) {
                const data = await res.json();
                setUsers(data.data);
                setPagination({
                    ...pagination,
                    page: data.pagination.page,
                    pageSize: data.pagination.pageSize,
                    total: data.pagination.total,
                });
            } else {
                message.error('Failed to fetch users');
            }
        } catch (error) {
            console.error(error);
            message.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        form.validateFields().then(async (values) => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(values),
                });
                if (res.ok) {
                    const newUser = await res.json();
                    message.success('User created successfully');
                    setCreateModalVisible(false);
                    form.resetFields();
                    // Reload users
                    fetchUsers(pagination.page, pagination.pageSize);
                } else {
                    message.error('Failed to create user');
                }
            } catch (error) {
                console.error(error);
                message.error('Server error');
            }
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => <Link to={`/users/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        }
    ];

    useEffect(() => {
        fetchUsers(pagination.page, pagination.pageSize);
        // eslint-disable-next-line
    }, []);

    const handlePageChange = (page, pageSize) => {
        setPagination({ ...pagination, page, pageSize });
        fetchUsers(page, pageSize);
    };

    return (
        <div>
            <h2>Users</h2>
            <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                Create User
            </Button>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
            <Pagination
                current={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                style={{ marginTop: 16, float: 'right' }}
            />

            <Modal
                title="Create User"
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onOk={handleCreateUser}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="timezone" label="Timezone">
                        <Input placeholder="Optional timezone" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Users;
