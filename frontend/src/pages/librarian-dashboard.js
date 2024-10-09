import React, { useState } from 'react';
import { useLibrary } from './LibraryContext'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';

const LibrarianDashboard = () => {
    const { state, dispatch } = useLibrary();
    const navigate = useNavigate();
    
    // Local states for adding/updating
    const [newBookTitle, setNewBookTitle] = useState('');
    const [newBookAuthor, setNewBookAuthor] = useState('');
    
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');

    // Add Book Function
    const addBook = () => {
        const newBook = { _id: Date.now(), title: newBookTitle, author: newBookAuthor };
        dispatch({ type: 'ADD_BOOK', payload: newBook });
        setNewBookTitle('');
        setNewBookAuthor('');
    };

    // Add Member Function
    const addMember = () => {
        const newMember = { _id: Date.now(), name: newMemberName, email: newMemberEmail };
        dispatch({ type: 'ADD_MEMBER', payload: newMember });
        setNewMemberName('');
        setNewMemberEmail('');
    };

    // Delete Member Function (mark as deleted)
    const deleteMember = (memberId) => {
        dispatch({ type: 'DELETE_MEMBER', payload: memberId });
    };

    return (
        <div className="dashboard-container">
            <header>
                <h1>Librarian Dashboard</h1>
                <button onClick={() => navigate('/login')}>Logout</button>
            </header>
            <h1>Books Management</h1>
            <input 
                type="text" 
                placeholder="Book Title" 
                value={newBookTitle} 
                onChange={(e) => setNewBookTitle(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Author" 
                value={newBookAuthor} 
                onChange={(e) => setNewBookAuthor(e.target.value)} 
            />
            <button onClick={addBook}>Add Book</button>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state.books.map(book => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                {/* Add update and delete buttons here */}
                                <button onClick={() => {/* update logic */}}>Update</button>
                                <button onClick={() => dispatch({ type: 'DELETE_BOOK', payload: book._id })}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h1>Members Management</h1>
            <input 
                type="text" 
                placeholder="Member Name" 
                value={newMemberName} 
                onChange={(e) => setNewMemberName(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={newMemberEmail} 
                onChange={(e) => setNewMemberEmail(e.target.value)} 
            />
            <button onClick={addMember}>Add Member</button>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state.members.map(member => (
                        <tr key={member._id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.deleted ? 'Deleted' : 'Active'}</td>
                            <td>
                                {/* Add update button here */}
                                {!member.deleted && (
                                    <>
                                        <button onClick={() => {/* update logic */}}>Update</button>
                                        <button onClick={() => deleteMember(member._id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Borrowing History Section */}
            <h1>Borrowing History</h1>
            <table>
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Book Title</th>
                        <th>Borrow Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
            <tbody>
            {state.borrowHistory.map(item => (
            <tr key={item._id}>
              <td>{item.memberName}</td>
              <td>{item.bookTitle}</td>
              <td>{item.borrowDate}</td>
              <td>{item.returnDate}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibrarianDashboard;