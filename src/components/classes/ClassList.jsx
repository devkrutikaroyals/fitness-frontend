import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Button,
  TextField,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ClassCard from './ClassCard';
import ClassForm from './ClassForm';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4)
  },
  table: {
    minWidth: 650
  },
  form: {
    marginTop: theme.spacing(4)
  }
}));

const ClassList = ({ isAdmin }) => {
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
// const classes = useStyles();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('/api/classes');
        setClasses(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = newClass => {
    setClasses([...classes, newClass]);
    setOpenForm(false);
  };

  if (loading) {
    return (
      <Container className={classes.root}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {isAdmin ? 'Manage Classes' : 'Available Classes'}
          </Typography>
        </Grid>
        {isAdmin && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenForm(true)}
            >
              Add New Class
            </Button>
          </Grid>
        )}
      </Grid>

      <TextField
        label="Search Classes"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {isAdmin ? (
        <TableContainer component={Paper} className={classes.table}>
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
                  <TableCell>
                    {new Date(cls.schedule).toLocaleString()}
                  </TableCell>
                  <TableCell>{cls.instructor}</TableCell>
                  <TableCell>{cls.capacity}</TableCell>
                  <TableCell>{cls.enrolledMembers.length}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      // onClick={() => handleEdit(cls._id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {filteredClasses.map(cls => (
            <Grid item xs={12} sm={6} md={4} key={cls._id}>
              <ClassCard cls={cls} />
            </Grid>
          ))}
        </Grid>
      )}

      {isAdmin && (
        <ClassForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={handleAddClass}
        />
      )}
    </Container>
  );
};

export default ClassList;