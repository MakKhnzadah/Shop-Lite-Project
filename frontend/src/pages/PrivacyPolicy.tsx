import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    useTheme,
} from '@mui/material';

const PrivacyPolicy: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ py: 8, bgcolor: '#FAFAFA' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                        Privacy Policy
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
                        We value your privacy. This page outlines how we collect, use, and protect your data.
                    </Typography>
                </Box>

                {/* Content */}
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
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        1. Information We Collect
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        When you contact us, we may collect personal information such as your name, email, and message.
                        This information will only be used to respond to your inquiry and improve our services.
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        2. How We Use Your Data
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Your data is not shared with third parties unless required by law. It is used internally
                        to address your request and offer improved support.
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        3. Data Protection
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        We implement industry-standard security measures to protect your data from unauthorized access.
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        4. Your Rights
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        You have the right to request correction, deletion, or access to your personal information.
                        Please email us if you wish to exercise these rights.
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        5. Contact Us
                    </Typography>
                    <Typography variant="body1">
                        If you have any privacy concerns, contact us at:
                        <br />
                        <strong>support@shoplite.com</strong>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default PrivacyPolicy;
