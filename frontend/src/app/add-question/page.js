"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Paper, Typography, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem, Alert,
  CircularProgress, Stack, Divider
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnifiedEditor from '@/components/editor/UnifiedEditor';
import { questionsAPI } from '@/lib/api';

const CATEGORIES = [
  'Core Java', 'Collections', 'Multithreading', 'JVM & Memory',
  'Spring Framework', 'Spring Boot', 'Spring Security',
  'Microservices', 'REST APIs', 'Database & JPA',
  'Design Patterns', 'Data Structures', 'Algorithms', 'System Design'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function AddQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Core Java',
    difficulty: 'Medium',
    question: '',
    answer: '',
    tags: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      setError('Question is required');
      return;
    }

    if (!formData.answer.trim() || formData.answer === '<p>Start writing your answer here...</p>') {
      setError('Answer is required');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await questionsAPI.create(formData);
      setSuccess(true);

      setFormData({
        category: 'Core Java',
        difficulty: 'Medium',
        question: '',
        answer: '',
        tags: '',
      });

      setTimeout(() => {
        router.push('/questions');
      }, 2000);
    } catch (err) {
      setError('Failed to add question. Please try again.');
      console.error('Error adding question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Add New Interview Question
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Create a comprehensive interview question with rich formatting, code blocks, images, and tables - all in one editor!
          </Typography>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Question added successfully! Redirecting to questions page...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={formData.difficulty}
                    label="Difficulty"
                    onChange={(e) => handleChange('difficulty', e.target.value)}
                  >
                    {DIFFICULTIES.map((diff) => (
                      <MenuItem key={diff} value={diff}>
                        {diff}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                required
                label="Question"
                multiline
                rows={2}
                value={formData.question}
                onChange={(e) => handleChange('question', e.target.value)}
                placeholder="Enter the interview question..."
                helperText="Example: What is the difference between HashMap and ConcurrentHashMap?"
              />

              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Answer * (Use the toolbar to format text, add code, images, and tables)
                </Typography>
                <UnifiedEditor
                  value={formData.answer}
                  onChange={(value) => handleChange('answer', value)}
                />
              </Box>

              <TextField
                fullWidth
                label="Tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="collections, threading, design-patterns"
                helperText="Comma-separated tags for better organization and search"
              />

              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Adding Question...' : 'Add Question'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}