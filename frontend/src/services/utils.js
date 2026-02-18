// src/services/utils.js
export function generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

export function formatError(error) {
    if (error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'An unknown error occurred';
}