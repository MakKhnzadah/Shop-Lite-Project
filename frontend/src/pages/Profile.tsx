import React from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, Avatar, Box } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                border: '2px solid #ddd' 
              }}
              alt={user?.firstName || 'User'}
              src={user?.profileImage}
            >
              {!user?.profileImage && (user?.firstName?.[0] || 'U')}
            </Avatar>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
              Change Photo
            </Button>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    defaultValue={user?.firstName || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    defaultValue={user?.lastName || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    defaultValue={user?.email || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    This is a basic profile view. The ability to edit profile information will be implemented in a future update.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;