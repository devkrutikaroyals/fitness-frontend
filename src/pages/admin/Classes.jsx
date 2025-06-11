import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert
} from '@mui/material';
import ClassForm from '../../components/classes/ClassForm';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/admin/classes');
        setClasses(res.data.data || []);
      } catch (err) {
        showAlert('Failed to load classes', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = async (classData) => {
    try {
      const res = await api.post('/admin/classes', classData);
      setClasses(prev => [...prev, res.data.data]);
      showAlert('Class created successfully');
      setOpenForm(false);
    } catch (err) {
      console.error('Error creating class:', err.response?.data);
      showAlert(
        err.response?.data?.message || 'Failed to create class',
        'error'
      );
    }
  };

  const handleUpdateClass = async (classData) => {
    try {
      const res = await api.put(`/admin/classes/${selectedClass._id}`, classData);
      setClasses(prev =>
        prev.map(cls => (cls._id === selectedClass._id ? res.data.data : cls))
      );
      showAlert('Class updated successfully');
      setOpenForm(false);
      setSelectedClass(null);
    } catch (err) {
      console.error('Error updating class:', err.response?.data);
      showAlert(
        err.response?.data?.message || 'Failed to update class',
        'error'
      );
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/admin/classes/${id}`);
        setClasses(prev => prev.filter(cls => cls._id !== id));
        showAlert('Class deleted successfully');
      } catch (err) {
        console.error('Error deleting class:', err.response?.data);
        showAlert(
          err.response?.data?.message || 'Failed to delete class',
          'error'
        );
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Manage Classes
      </Typography>
      
      <Button
        variant="contained"
        onClick={() => {
          setSelectedClass(null);
          setOpenForm(true);
        }}
        sx={{ mb: 2 }}
      >
        Add New Class
      </Button>

      <TextField
        label="Search Classes"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Enrolled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClasses.map(cls => (
              <TableRow key={cls._id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{new Date(cls.schedule).toLocaleString()}</TableCell>
                <TableCell>{cls.instructor}</TableCell>
                <TableCell>{cls.capacity}</TableCell>
                <TableCell>{cls.enrolledMembers?.length || 0}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedClass(cls);
                      setOpenForm(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClass(cls._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
        <DialogContent>
          <ClassForm
            initialData={selectedClass}
            onSubmit={selectedClass ? handleUpdateClass : handleAddClass}
            onCancel={() => {
              setOpenForm(false);
              setSelectedClass(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Classes;