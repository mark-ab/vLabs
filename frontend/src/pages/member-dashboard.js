import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeftRight, Trash2, History, LogOut } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

// If you haven't set up the API service yet, you can use dummy data
const dummyBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'AVAILABLE' },
  { id: 2, title: '1984', author: 'George Orwell', status: 'BORROWED' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'AVAILABLE' },
];

const dummyHistory = [
  { id: 1, title: 'The Great Gatsby', action: 'borrowed', action_date: '2024-03-15' },
  { id: 2, title: '1984', action: 'returned', action_date: '2024-03-10' },
];

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(dummyBooks);
  const [borrowHistory, setBorrowHistory] = useState(dummyHistory);
  const [activeView, setActiveView] = useState('books');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const handleBorrowReturn = (bookId) => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        const newStatus = book.status === 'AVAILABLE' ? 'BORROWED' : 'AVAILABLE';
        const action = newStatus === 'BORROWED' ? 'borrowed' : 'returned';
        
        setBorrowHistory([
          {
            id: Date.now(),
            title: book.title,
            action: action,
            action_date: new Date().toISOString().split('T')[0]
          },
          ...borrowHistory
        ]);
        
        return { ...book, status: newStatus };
      }
      return book;
    }));
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    // Implement actual delete logic here
  };

  const handleLogout = () => {
    // Clear any user data from localStorage if you're using it
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // You might want to call your logout API endpoint here
    // await logoutAPI();
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Member Dashboard</Typography>
        <Box>
          <Button
            variant={activeView === 'books' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('books')}
            startIcon={<Book />}
            sx={{ mr: 1 }}
          >
            Books
          </Button>
          <Button
            variant={activeView === 'history' ? 'contained' : 'outlined'}
            onClick={() => setActiveView('history')}
            startIcon={<History />}
            sx={{ mr: 1 }}
          >
            History
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            startIcon={<Trash2 />}
            sx={{ mr: 1 }}
          >
            Delete Account
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            startIcon={<LogOut />}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Rest of the component remains the same */}
      
      {activeView === 'books' ? (
        <Grid container spacing={3}>
          {books.map(book => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{book.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>{book.author}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip
                      label={book.status}
                      color={book.status === 'AVAILABLE' ? 'success' : 'warning'}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleBorrowReturn(book.id)}
                      startIcon={<ArrowLeftRight />}
                    >
                      {book.status === 'AVAILABLE' ? 'Borrow' : 'Return'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Borrowing History</Typography>
            {borrowHistory.length === 0 ? (
              <Typography color="textSecondary">No borrowing history yet.</Typography>
            ) : (
              borrowHistory.map((record, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: index < borrowHistory.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Box>
                    <Typography variant="subtitle1">{record.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {record.action_date}
                    </Typography>
                  </Box>
                  <Chip
                    label={record.action.charAt(0).toUpperCase() + record.action.slice(1)}
                    color={record.action === 'borrowed' ? 'primary' : 'success'}
                  />
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}