import React, { createContext, useContext, useReducer } from 'react';

const LibraryContext = createContext();

const initialState = {
    books: [],
    members: [],
    borrowHistory: [],
    loading: false,
    error: null,
};

function libraryReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_BOOKS':
            return { ...state, books: action.payload, loading: false };
        case 'SET_MEMBERS':
            return { ...state, members: action.payload, loading: false };
        case 'SET_HISTORY':
            return { ...state, borrowHistory: action.payload, loading: false };
        case 'ADD_BOOK':
            return { ...state, books: [...state.books, action.payload] };
        case 'UPDATE_BOOK':
            return {
                ...state,
                books: state.books.map(book =>
                    book._id === action.payload._id ? action.payload : book
                ),
            };
        case 'DELETE_BOOK':
            return {
                ...state,
                books: state.books.filter(book => book._id !== action.payload),
            };
        case 'ADD_MEMBER':
            return { ...state, members: [...state.members, action.payload] };
        case 'UPDATE_MEMBER':
            return {
                ...state,
                members: state.members.map(member =>
                    member._id === action.payload._id ? action.payload : member
                ),
            };
        case 'DELETE_MEMBER':
            return {
                ...state,
                members: state.members.map(member =>
                    member._id === action.payload ? { ...member, deleted: true } : member
                ),
            };
        default:
            return state;
    }
}

export function LibraryProvider({ children }) {
    const [state, dispatch] = useReducer(libraryReducer, initialState);

    return (
        <LibraryContext.Provider value={{ state, dispatch }}>
            {children}
        </LibraryContext.Provider>
    );
}

export function useLibrary() {
    const context = useContext(LibraryContext);
    if (!context) {
        throw new Error('useLibrary must be used within a LibraryProvider');
    }
    return context;
}