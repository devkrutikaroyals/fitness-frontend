import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert
} from '@mui/material';
import './WorkoutPlanForm.css'; // Make sure this file is created

const WorkoutPlanForm = ({ members = [], initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    file: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assignedTo: initialData.assignedTo?._id || '',
        file: null
      });
    }
  }, [initialData]);



    const handleChange = (e) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
      setError(null);
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setError(null);
    };

const handleSubmit = (e) => {
  e.preventDefault();

  // Validate form
  if (!formData.assignedTo) {
    setError('Please select a member');
    return;
  }

  if (!initialData && !formData.file) {
    setError('PDF file is required');
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append('title', formData.title);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('assignedTo', formData.assignedTo);
  
  // For updates, include the ID
  if (initialData) {
    formDataToSend.append('_id', initialData._id);
  }
  
  // Only append file if it exists
  if (formData.file) {
    formDataToSend.append('file', formData.file);
  }

  onSubmit(formDataToSend);
};
    return (
      <form className="workout-form" onSubmit={handleSubmit}>
        {error && <Alert severity="error" className="form-alert">{error}</Alert>}

        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          className="form-field"
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          className="form-field"
        />

        <FormControl fullWidth required className="form-field">
          <InputLabel id="assignedTo-label">Assign To</InputLabel>
          <Select
            labelId="assignedTo-label"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Member --</MenuItem>
            {members.map(member => (
              <MenuItem key={member._id} value={member._id}>
                {member.name} ({member.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <div className="file-upload">
          <label className="file-label">
            Upload PDF {!initialData && <span className="required">*</span>}
          </label>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required={!initialData}
          />
          {initialData?.file && (
            <Typography variant="caption" className="file-caption">
              Current: {initialData.file}
            </Typography>
          )}
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="submit-button"
        >
          {initialData ? 'Update Workout Plan' : 'Assign Workout Plan'}
        </Button>
      </form>
    );
  };

  export default WorkoutPlanForm;
