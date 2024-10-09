const BASE_URL = 'http://localhost:8080/api';

async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
    }

    return response.json();
}

export const bookService = {
    getAll: () => fetchWithAuth('/books'),
    add: (bookData) => fetchWithAuth('/books', {
        method: 'POST',
        body: JSON.stringify(bookData),
    }),
    update: (id, bookData) => fetchWithAuth(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bookData),
    }),
    delete: (id) => fetchWithAuth(`/books/${id}`, {
        method: 'DELETE',
    }),
    borrow: (bookId) => fetchWithAuth(`/books/${bookId}/borrow`, {
        method: 'POST',
    }),
    return: (bookId) => fetchWithAuth(`/books/${bookId}/return`, {
        method: 'POST',
    }),
};

export const memberService = {
    getAll: () => fetchWithAuth('/members'),
    add: (memberData) => fetchWithAuth('/members', {
        method: 'POST',
        body: JSON.stringify(memberData),
    }),
    update: (id, memberData) => fetchWithAuth(`/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(memberData),
    }),
    delete: (id) => fetchWithAuth(`/members/${id}`, {
        method: 'DELETE',
    }),
    getDeleted: () => fetchWithAuth('/members/deleted'),
};

export const historyService = {
    getAll: () => fetchWithAuth('/history'),
    getMemberHistory: (memberId) => fetchWithAuth(`/history/member/${memberId}`),
};