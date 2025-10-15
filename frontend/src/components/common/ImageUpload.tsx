import React, { useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';

// MUI Components
import { 
  Box, 
  Button, 
  Typography, 
  LinearProgress, 
  Paper, 
  IconButton, 
  Stack, 
  useTheme,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
}

const ImageUpload: React.FC<FileUploadProps> = ({ 
  onUploadSuccess, 
  acceptedFileTypes = 'image/*', 
  maxFileSize = 5 // 5MB default
}) => {
  const theme = useTheme();
  const { token } = useAppSelector((state: RootState) => state.auth);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Check file type
      if (!selectedFile.type.match(acceptedFileTypes.replace(/\*/g, '.*'))) {
        setError(`Only ${acceptedFileTypes} files are accepted`);
        return;
      }
      
      // Check file size
      if (selectedFile.size > maxFileSize * 1024 * 1024) {
        setError(`File size must be less than ${maxFileSize}MB`);
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    if (!token) {
      setError('Authentication required. Please log in to upload files.');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(
        'http://localhost:8080/api/uploads/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percentCompleted);
          }
        }
      );
      
      setSuccess(true);
      onUploadSuccess(response.data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    setSuccess(false);
  };
  
  return (
    <Box>
      {!token && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please log in to upload images.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          File uploaded successfully!
        </Alert>
      )}
      
      {/* Upload Area */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          borderStyle: 'dashed',
          borderColor: theme.palette.primary.light,
          p: 4,
          textAlign: 'center',
          backgroundColor: 'rgba(184, 134, 11, 0.03)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(184, 134, 11, 0.05)',
            borderColor: theme.palette.primary.main
          }
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {!preview ? (
          <Box>
            <CloudUploadIcon 
              sx={{ 
                fontSize: 60, 
                color: theme.palette.primary.main,
                mb: 2
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Drag & Drop or Click to Upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`Supports ${acceptedFileTypes} files up to ${maxFileSize}MB`}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: 1
              }}
            />
          </Box>
        )}
        <input
          id="file-input"
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Paper>
      
      {/* Progress Bar */}
      {uploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {`Uploading... ${progress}%`}
          </Typography>
        </Box>
      )}
      
      {/* Controls */}
      {file && (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ flexGrow: 1 }} noWrap>
            {file.name}
          </Typography>
          
          {!success && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}
              startIcon={<CloudUploadIcon />}
              sx={{ boxShadow: 'none' }}
            >
              Upload
            </Button>
          )}
          
          {success && (
            <IconButton color="success">
              <CheckCircleIcon />
            </IconButton>
          )}
          
          <IconButton color="error" onClick={handleRemove}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default ImageUpload;