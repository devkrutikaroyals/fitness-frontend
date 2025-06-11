import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  SvgIcon 
} from '@mui/material';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              gutterBottom
            >
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SvgIcon sx={{ color: 'white', fontSize: 30 }}>
              <path d={`M12 2L4 12l8 10 8-10z`} />
            </SvgIcon>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;