// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    ScheduleOutlined,
    LoginOutlined,
    LogoutOutlined
} from '@ant-design/icons';

import Login from './pages/Login/Login';
import Users from './pages/Users/Users';
import UserDetail from './pages/Users/UserDetail';
import Events from './pages/Events/Events';
import EventDetail from './pages/Events/EventDetail';
import Schedules from './pages/Schedules/Schedules';
import ScheduleDetail from './pages/Schedules/ScheduleDetail';
import Appointments from './pages/Appointments/Appointments';
import AppointmentDetail from './pages/Appointments/AppointmentDetail';
import Register from './pages/Register/Register';

import { getToken, removeToken, getAuthHeaders } from './utils/authHelpers';

const { Header, Content, Sider } = Layout;

function App() {
    const [authenticated, setAuthenticated] = useState(false);

    // Kontrollime, kas token on olemas (lihtsustatud sessiooni kontroll)
    useEffect(() => {
        if (getToken()) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, []);

    // Logout funktsioon, mis kutsub backendist sessions DELETE
    const handleLogout = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/sessions`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            removeToken();
            setAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider breakpoint="lg" collapsedWidth="0">
                    <div style={{ height: 32, margin: 16, background: 'rgba(255,255,255,.3)' }} />
                    <Menu theme="dark" mode="inline">
                        {!authenticated && (
                            <Menu.Item key="login" icon={<LoginOutlined />}>
                                <Link to="/login">Login</Link>
                            </Menu.Item>
                        )}
                        {authenticated && (
                            <>
                                <Menu.Item key="users" icon={<UserOutlined />}>
                                    <Link to="/users">Users</Link>
                                </Menu.Item>
                                <Menu.Item key="events" icon={<CalendarOutlined />}>
                                    <Link to="/events">Events</Link>
                                </Menu.Item>
                                <Menu.Item key="schedules" icon={<ScheduleOutlined />}>
                                    <Link to="/schedules">Schedules</Link>
                                </Menu.Item>
                                <Menu.Item key="appointments" icon={<ClockCircleOutlined />}>
                                    <Link to="/appointments">Appointments</Link>
                                </Menu.Item>
                            </>
                        )}
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ padding: '0 16px', background: '#fff' }}>
                        {authenticated && (
                            <Button
                                onClick={handleLogout}
                                style={{ float: 'right' }}
                                icon={<LogoutOutlined />}
                            >
                                Logout
                            </Button>
                        )}
                    </Header>
                    <Content style={{ margin: '16px' }}>
                        <Routes>
                            <Route path="/" element={<h1>Tere tulemast Calendly Clone rakendusse!</h1>} />

                            {/* Login */}
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login onLoginSuccess={() => setAuthenticated(true)} />} />

                            {/* Users */}
                            <Route path="/users" element={<Users />} />
                            <Route path="/users/:userId" element={<UserDetail />} />

                            {/* Events */}
                            <Route path="/events" element={<Events />} />
                            <Route path="/events/:eventId" element={<EventDetail />} />

                            {/* Schedules */}
                            <Route path="/schedules" element={<Schedules />} />
                            <Route path="/schedules/:userId" element={<ScheduleDetail />} />

                            {/* Appointments */}
                            <Route path="/appointments" element={<Appointments />} />
                            <Route path="/appointments/:appointmentId" element={<AppointmentDetail />} />

                            <Route path="*" element={<h1>404 - Not Found</h1>} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}

export default App;
