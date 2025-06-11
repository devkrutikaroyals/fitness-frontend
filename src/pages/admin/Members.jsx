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
import MemberForm from '../../components/members/MemberForm';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/admin/members');
        setMembers(res.data.data || []);
      } catch (err) {
        showAlert('Failed to load members', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

   const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };
  const handleAddMember = async (memberData) => {
    try {
      const res = await api.post('/admin/members', {
        name: memberData.name,
        email: memberData.email,
        password: memberData.password
      });
      
      setMembers(prev => [...prev, res.data.data]);
      setOpenForm(false);
      showAlert('Member created successfully');
    } catch (err) {
      console.error('Error details:', err.response?.data);
      showAlert(
        err.response?.data?.message || 'Failed to create member', 
        'error'
      );
    }
  };

  const handleUpdateMember = async (memberData) => {
    try {
      const res = await api.put(`/admin/members/${editingMember._id}`, memberData);
      setMembers(prev =>
        prev.map(m => (m._id === editingMember._id ? res.data.data : m))
      );
      setOpenForm(false);
      setEditingMember(null);
    } catch (err) {
      console.error(err);
    }
  };

 const handleDeleteMember = async (id) => {
  if (window.confirm('Are you sure you want to delete this member?')) {
    try {
      await api.delete(`/admin/members/${id}`);
      setMembers(prev => prev.filter(m => m._id !== id));
      showAlert('Member deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showAlert('Failed to delete member', 'error');
    }
  }
};


  const handleEditClick = (member) => {
    setEditingMember(member);
    setOpenForm(true);
  };

  return (
    <Container maxWidth="lg">
      <div className="members-header">
        <Typography variant="h4">Manage Members</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenForm(true)}
        >
          Add New Member
        </Button>
      </div>

      <TextField
        label="Search Members"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map(member => (
              <TableRow key={member._id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
  <Button
    variant="outlined"
    color="primary"
    size="small"
    onClick={() => handleEditClick(member)}
    style={{ marginRight: '8px' }}
  >
    Edit
  </Button>
  <Button
    variant="outlined"
    color="error"
    size="small"
    onClick={() => handleDeleteMember(member._id)}
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
        <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
       <DialogContent>
  <MemberForm
    initialData={editingMember}
    onSubmit={editingMember ? handleUpdateMember : handleAddMember}
    onCancel={() => {
      setOpenForm(false);
      setEditingMember(null);
    }}
  />
</DialogContent>

 <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
      </Dialog>

    </Container>
  );
};

export default Members;
