import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import './ClassForm.css';

const ClassForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    duration: 60,
    capacity: 20,
    instructor: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        schedule: initialData.schedule
          ? new Date(initialData.schedule).toISOString().slice(0, 16)
          : '',
        duration: initialData.duration || 60,
        capacity: initialData.capacity || 20,
        instructor: initialData.instructor || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      duration: Number(formData.duration),
      capacity: Number(formData.capacity)
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="class-form">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Class Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Schedule"
            type="datetime-local"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {initialData ? 'Update Class' : 'Create Class'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default ClassForm;
