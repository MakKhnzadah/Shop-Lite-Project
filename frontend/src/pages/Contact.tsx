import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	TextField,
	Button,
	Paper,
	Divider,
	useTheme,
} from '@mui/material';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';

const Contact: React.FC = () => {
	const theme = useTheme();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Contact form submitted:', formData);
		alert('Thank you for contacting Shop Lite! We will respond shortly.');
		setFormData({ name: '', email: '', message: '' });
	};

	return (
		<Box sx={{ py: 8, bgcolor: '#FAFAFA' }}>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: 'center', mb: 6 }}>
					<Typography variant="h2" component="h2" sx={{ mb: 2 }}>
						Contact Us
					</Typography>
					<Divider
						sx={{
							width: 80,
							margin: '0 auto',
							borderWidth: 2,
							borderColor: theme.palette.primary.main,
							mb: 3,
						}}
					/>
					<Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
						Have questions or feedback? We would love to hear from you. Send us a message or visit us at our office.
					</Typography>
				</Box>

				<Grid container spacing={6}>
					<Grid item xs={12} md={6}>
						<Paper
							elevation={0}
							sx={{
								p: 4,
								border: '1px solid',
								borderColor: theme.palette.divider,
								borderRadius: 2,
								boxShadow: 'none',
							}}
						>
							<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
								Send a Message
							</Typography>
							<Box component="form" onSubmit={handleSubmit}>
								<TextField
									label="Your Name"
									name="name"
									fullWidth
									required
									margin="normal"
									value={formData.name}
									onChange={handleChange}
								/>
								<TextField
									label="Email"
									name="email"
									type="email"
									fullWidth
									required
									margin="normal"
									value={formData.email}
									onChange={handleChange}
								/>
								<TextField
									label="Message"
									name="message"
									fullWidth
									required
									multiline
									rows={4}
									margin="normal"
									value={formData.message}
									onChange={handleChange}
								/>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									size="large"
									sx={{ mt: 2, py: 1.2, px: 4, borderRadius: 1 }}
								>
									Send Message
								</Button>
							</Box>
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper
							elevation={0}
							sx={{
								p: 4,
								border: '1px solid',
								borderColor: theme.palette.divider,
								borderRadius: 2,
								mb: 3,
							}}
						>
							<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
								Get in Touch
							</Typography>

							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<RoomOutlinedIcon color="primary" sx={{ mr: 2 }} />
								<Typography variant="body1">123 E-Commerce Street, Grimstad, Norway</Typography>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<LocalPhoneOutlinedIcon color="primary" sx={{ mr: 2 }} />
								<Typography variant="body1">+47 987 654 321</Typography>
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<EmailOutlinedIcon color="primary" sx={{ mr: 2 }} />
								<Typography variant="body1">support@shoplite.com</Typography>
							</Box>
						</Paper>

						<Paper
							elevation={0}
							sx={{
								border: '1px solid',
								borderColor: theme.palette.divider,
								borderRadius: 2,
								overflow: 'hidden',
							}}
						>
							<iframe
								title="Shop Lite Location"
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2580.492646309708!2d8.59343!3d58.33758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4647cc05e7b4d7cd%3A0x40f7e2d09b3c9024!2sUniversity%20of%20Agder%20-%20Campus%20Grimstad!5e0!3m2!1sen!2sno!4v1700000000000!5m2!1sen!2sno"
								width="100%"
								height="250"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Contact;
