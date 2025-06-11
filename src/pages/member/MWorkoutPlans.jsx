import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../utils/api';
import '../member/MWorkoutPlans.css'; // ✅ External CSS import

const WorkoutPlansPage = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchWorkoutPlans = async (search = '') => {
    try {
      setLoading(true);
      const res = await api.get('/member/workout-plans', {
        params: { search }
      });
      setWorkoutPlans(res.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      message.error('Failed to fetch workout plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Assigned To',
      dataIndex: ['assignedTo', 'name'],
      key: 'assignedTo',
    },
    {
      title: 'Assigned On',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            href={record.file} 
            target="_blank"
            icon={<DownloadOutlined />}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="workout-plans-container">
      <div className="header">
        <h2>Manage Workout Plans</h2>
        <div className="actions">
          <Input.Search
            placeholder="Search Plans"
            allowClear
            enterButton
            value={searchText}
            onSearch={fetchWorkoutPlans}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            ASSIGN NEW PLAN
          </Button>
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={workoutPlans}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default WorkoutPlansPage;
