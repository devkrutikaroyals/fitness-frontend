import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import './MDashboard.css';

const MemberDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, plansRes] = await Promise.all([
          axios.get(`/api/classes/member/${user._id}`),
          axios.get(`/api/workout-plans/member/${user._id}`)
        ]);
        setEnrolledClasses(classesRes.data.data || []);
        setWorkoutPlans(plansRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id]);

  if (loading) {
    return (
      <div className="member-dashboard__center">
        <div className="member-dashboard__loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="member-dashboard__error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="member-dashboard__container">
      <h2 className="member-dashboard__header">Welcome, {user.name}</h2>

      <div className="member-dashboard__grid">
        {/* Classes Section */}
        <div className="member-dashboard__card">
          <div className="member-dashboard__card-title">💪 Your Classes</div>
          {enrolledClasses.length > 0 ? (
            <div className="member-dashboard__list">
              {enrolledClasses.slice(0, 3).map((cls) => (
                <div key={cls._id} className="member-dashboard__item">
                  <div className="member-dashboard__item-main">{cls.name}</div>
                  <div className="member-dashboard__item-sub">
                    {new Date(cls.schedule).toLocaleString()} with {cls.instructor}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="member-dashboard__no-data">You are not enrolled in any classes yet.</p>
          )}
          <button
            className="member-dashboard__button"
            onClick={() => navigate('/member/classes')}
          >
            {enrolledClasses.length > 0 ? 'View All Classes' : 'Browse Classes'}
          </button>
        </div>

        {/* Workout Plans Section */}
        <div className="member-dashboard__card">
          <div className="member-dashboard__card-title">📄 Your Workout Plans</div>
          {workoutPlans.length > 0 ? (
            <div className="member-dashboard__list">
              {workoutPlans.slice(0, 3).map((plan) => (
                <div key={plan._id} className="member-dashboard__item plan">
                  <div>
                    <div className="member-dashboard__item-main">{plan.title}</div>
                    <div className="member-dashboard__item-sub">
                      Assigned on {new Date(plan.assignedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <a
                    href={`/uploads/${plan.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="member-dashboard__view-link"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="member-dashboard__no-data">You don't have any workout plans assigned yet.</p>
          )}
          <button
            className="member-dashboard__button"
            onClick={() => navigate('/member/workout-plans')}
          >
            {workoutPlans.length > 0 ? 'View All Plans' : 'Check Back Later'}
          </button>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="member-dashboard__schedule">
        <h3 className="member-dashboard__card-title">📅 Upcoming Schedule</h3>
        {enrolledClasses.length > 0 ? (
          <div className="member-dashboard__list">
            {enrolledClasses
              .filter((cls) => new Date(cls.schedule) > new Date())
              .sort((a, b) => new Date(a.schedule) - new Date(b.schedule))
              .slice(0, 3)
              .map((cls) => (
                <div key={cls._id} className="member-dashboard__item">
                  <div className="member-dashboard__item-main">{cls.name}</div>
                  <div className="member-dashboard__item-sub">
                    {new Date(cls.schedule).toLocaleString()} - {cls.instructor}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="member-dashboard__no-data">No upcoming classes scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
