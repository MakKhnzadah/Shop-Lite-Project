import React from 'react';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';

const Contact: React.FC = () => {
	return (
		<Box sx={{ py: 8, bgcolor: '#f9f9f9' }}>
			<Container maxWidth="md">
				<Typography variant="h3" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
					Get in Touch
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
					We would love to hear from you. Fill out the form below and we will respond promptly.
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<TextField label="First Name" variant="outlined" fullWidth required />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField label="Last Name" variant="outlined" fullWidth required />
					</Grid>
					<Grid item xs={12}>
						<TextField type="email" label="Email" variant="outlined" fullWidth required />
					</Grid>
					<Grid item xs={12}>
						<TextField label="Message" variant="outlined" fullWidth multiline minRows={4} required />
					</Grid>
					<Grid item xs={12}>
						<Button type="submit" variant="contained" color="primary" size="large">
							Send Message
						</Button>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Contact;
