// src/utils/authHelpers.js
export function getToken() {
    return localStorage.getItem('authToken');
}

export function setToken(token) {
    localStorage.setItem('authToken', token);
}

export function removeToken() {
    localStorage.removeItem('authToken');
}

export function getAuthHeaders() {
    const token = getToken();
    return token
        ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };
}
