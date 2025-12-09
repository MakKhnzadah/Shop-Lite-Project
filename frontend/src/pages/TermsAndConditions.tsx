import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    useTheme,
} from '@mui/material';

const TermsAndConditions: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ py: 8, bgcolor: '#FAFAFA' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                        Terms & Conditions
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
                        Please read these carefully before using our services.
                    </Typography>
                </Box>

                {/* Content Section */}
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
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        1. Introduction
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions.
                        If you do not agree, please do not use the platform.
                    </Typography>

                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        2. User Responsibilities
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        You agree to use the website responsibly and not engage in any illegal or harmful activity.
                    </Typography>

                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        3. Orders & Payments
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        All orders are subject to availability and confirmation. Prices may change without notice.
                    </Typography>

                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        4. Limitation of Liability
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        We are not liable for any damages resulting from use of the platform beyond legal obligations.
                    </Typography>

                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        5. Changes to Terms
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        We may update these Terms without notice. Continued use of the website implies acceptance.
                    </Typography>

                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        6. Contact
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        If you have questions regarding these Terms, contact us at: <strong>support@shoplite.com</strong>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default TermsAndConditions;
