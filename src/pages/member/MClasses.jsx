import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import './MClasses.css';

const MClasses = () => {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const classesRes = await api.get('/member/classes');
        const enrolledRes = user?._id
          ? await api.get('/member/my-classes')
          : { data: [] };

        setClasses(classesRes.data.data || classesRes.data || []);
        setEnrolledClasses(enrolledRes.data.data?.map(c => c._id) || []);
      } catch (err) {
        console.error('Error loading classes:', {
          url: err.config?.url,
          status: err.response?.status,
          error: err.response?.data?.message || err.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  const handleEnroll = async (classId) => {
    try {
      await api.put(`/member/classes/${classId}/enroll`);
      setEnrolledClasses(prev => [...prev, classId]);

      setClasses(prev => prev.map(cls =>
        cls._id === classId
          ? { ...cls, enrolledMembers: [...(cls.enrolledMembers || []), user._id] }
          : cls
      ));
    } catch (err) {
      console.error('Enrollment error:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mclasses-container">
      <h2>Available Classes</h2>

      <input
        type="text"
        placeholder="Search Classes"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      <div className="class-grid">
        {filteredClasses.map(cls => (
          <div className="class-card" key={cls._id}>
            <div className="card-content">
              <h3>{cls.name}</h3>
              <p><strong>Instructor:</strong> {cls.instructor}</p>
              <p>{cls.description}</p>
              <p><strong>Schedule:</strong> {cls.schedule ? new Date(cls.schedule).toLocaleString() : 'N/A'}</p>
              <p><strong>Duration:</strong> {cls.duration || 0} minutes</p>
              <div className={`capacity-chip ${cls.enrolledMembers?.length >= cls.capacity ? 'full' : ''}`}>
                {`${cls.enrolledMembers?.length || 0}/${cls.capacity || 0}`}
              </div>
            </div>
            <div className="card-actions">
              {enrolledClasses.includes(cls._id) ? (
                <button className="btn enrolled" disabled>Already Enrolled</button>
              ) : (cls.enrolledMembers?.length || 0) >= (cls.capacity || 0) ? (
                <button className="btn full" disabled>Class Full</button>
              ) : (
                <button className="btn enroll" onClick={() => handleEnroll(cls._id)}>Enroll Now</button>
              )}
              <Link to={`/member/classes/${cls._id}`} className="btn details">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MClasses;
