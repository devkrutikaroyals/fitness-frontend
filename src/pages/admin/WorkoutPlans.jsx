import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import WorkoutPlanForm from '../../components/workoutPlans/WorkoutPlanForm';

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, membersRes] = await Promise.all([
          api.get('/admin/workout-plans'),
          api.get('/admin/members')
        ]);
        
        setPlans(plansRes.data.data || []);
        setMembers(membersRes.data.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        showAlert('Failed to load data. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPlans = plans.filter(plan =>
    plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

const handleAddPlan = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };

    const res = await api.post('/admin/workout-plans', formData, config);
    
    setPlans([...plans, res.data.data]);
    showAlert('Workout plan created successfully!');
    setOpenForm(false);
  } catch (err) {
    console.error('Full error:', err);
    console.error('Error response:', err.response?.data);
    showAlert(
      err.response?.data?.message || 'Failed to create workout plan. Please try again.',
      'error'
    );
  }
};


const handleUpdatePlan = async (formData) => {
  try {
    const planId = formData.get('_id');
    const res = await api.put(`/admin/workout-plans/${planId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    setPlans(plans.map(plan => 
      plan._id === planId ? res.data.data : plan
    ));
    showAlert('Workout plan updated successfully');
    setOpenForm(false);
    setSelectedPlan(null);
  } catch (err) {
    console.error('Error updating workout plan:', err.response?.data || err);
    showAlert(
      err.response?.data?.message || 'Failed to update workout plan',
      'error'
    );
  }
};

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await api.delete(`/admin/workout-plans/${id}`);
        setPlans(plans.filter(plan => plan._id !== id));
        showAlert('Workout plan deleted successfully');
      } catch (err) {
        console.error('Error deleting workout plan:', err.response?.data);
        showAlert(
          err.response?.data?.message || 'Failed to delete workout plan',
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
        Manage Workout Plans
      </Typography>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          label="Search Plans"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedPlan(null);
            setOpenForm(true);
          }}
        >
          Assign New Plan
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Assigned On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlans.map(plan => (
              <TableRow key={plan._id}>
                <TableCell>{plan.title}</TableCell>
                <TableCell>{plan.assignedTo?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(plan.assignedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                 <IconButton
  color="primary"
  onClick={() => window.open(plan.file, '_blank')} // direct Cloudinary URL
>
  <Visibility />
</IconButton>

                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setOpenForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeletePlan(plan._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => {
        setOpenForm(false);
        setSelectedPlan(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPlan ? 'Edit Workout Plan' : 'Assign New Workout Plan'}
        </DialogTitle>
        <DialogContent>
          <WorkoutPlanForm 
            members={members}
            initialData={selectedPlan}
            onSubmit={selectedPlan ? handleUpdatePlan : handleAddPlan}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenForm(false);
            setSelectedPlan(null);
          }}>
            Cancel
          </Button>
        </DialogActions>
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

export default WorkoutPlans;