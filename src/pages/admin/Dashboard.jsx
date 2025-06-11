import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import api from '../../utils/api'; // ✅ Only once

import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Box,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';


const StatCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  textAlign: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:nth-of-type(2)': {
    backgroundColor: theme.palette.secondary.main,
  },
  '&:nth-of-type(3)': {
    backgroundColor: theme.palette.success.main,
  },
}));

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ 
    membersCount: 0, 
    classesCount: 0, 
    plansCount: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchStats = async () => {
    try {
      console.log('Fetching stats from:', '/admin/stats');
      const res = await api.get('/admin/stats');
      console.log('API Response:', res.data);
      
      // Updated extraction logic to match the new API response structure
      const statsData = res.data?.data?.stats || res.data?.stats || res.data;
      
      console.log('Extracted stats:', statsData);
      
      setStats({
        membersCount: statsData?.membersCount || 0,
        classesCount: statsData?.classesCount || 0,
        plansCount: statsData?.plansCount || 0
      });
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to load dashboard statistics'
      );
      setStats({
        membersCount: 0,
        classesCount: 0,
        plansCount: 0
      });
    } finally {
      setLoading(false);
    }
  };
  
  fetchStats();
}, []);
  const quickActions = [
    { label: 'Manage Members', path: '/admin/members' },
    { label: 'Manage Classes', path: '/admin/classes' },
    { label: 'Assign Workout Plans', path: '/admin/workout-plans' }
  ];

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'Admin'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Dashboard Overview
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ my: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatCard>
              <CardContent>
                <Typography variant="h2" component="div">
                  {stats.membersCount}
                </Typography>
                <Typography variant="h6">
                  Total Members
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard>
              <CardContent>
                <Typography variant="h2" component="div">
                  {stats.classesCount}
                </Typography>
                <Typography variant="h6">
                  Total Classes
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard>
              <CardContent>
                <Typography variant="h2" component="div">
                  {stats.plansCount}
                </Typography>
                <Typography variant="h6">
                  Workout Plans
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, idx) => (
              <Grid item key={idx}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate(action.path)}
                  sx={{ minWidth: 200 }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Activity Placeholder */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Recent Activity
          </Typography>
          <Paper sx={{ p: 2, minHeight: 200 }}>
            <Typography color="text.secondary">
              Activity feed will be displayed here
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;