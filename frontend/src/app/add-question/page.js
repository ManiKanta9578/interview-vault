"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container, Paper, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Alert,
  CircularProgress, Stack, Chip, alpha, Card, Grid, Tabs, Tab
} from "@mui/material";
import {
  Save, ArrowBack, AddCircle, CheckCircle, Category, 
  Help, Visibility, Edit, QuestionAnswer
} from "@mui/icons-material";

import ProtectedRoute from "@/components/ProtectedRoute";
import { questionsAPI } from "@/lib/api";
import { useTheme, useMediaQuery } from "@mui/material";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";
import ReactQuillViewer from "@/components/editor/ReactQuillViewer";

import DOMPurify from "dompurify";

const CATEGORIES = [
  { label: 'Core Java', subCategories: ["OOP Concepts", "Exception Handling", "Generics"] },
  { label: 'Collections', subCategories: ["List/ArrayList", "Map/HashMap", "Set/HashSet"] },
  { label: 'Multithreading', subCategories: ["Thread Lifecycle", "Executor Framework", "Locks"] },
  { label: 'Spring Boot', subCategories: ["Dependency Injection", "Spring Security", "Spring Data JPA"] },
  { label: 'Microservices', subCategories: ["REST APIs", "API Gateway", "Circuit Breakers"] },
  { label: 'Database & JPA', subCategories: ["SQL Basics", "Transactions", "Hibernate"] },
  { label: 'Algorithms', subCategories: ["Sorting", "Searching", "Dynamic Programming"] },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function AddQuestionPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const [formData, setFormData] = useState({
    category: "Core Java",
    subCategory: "OOP Concepts",
    difficulty: "Medium",
    question: "",
    answer: "",
    tags: "",
  });

  const htmlToPlain = (html = "") => {
    const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return clean.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  };

  useEffect(() => {
    const plainAnswer = htmlToPlain(formData.answer);
    const plainQuestion = formData.question.trim();
    const totalPlain = `${plainQuestion} ${plainAnswer}`.trim();
    const totalWords = totalPlain ? totalPlain.split(/\s+/).filter(Boolean).length : 0;
    setWordCount(totalWords);
  }, [formData.question, formData.answer]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.question.trim()) {
      setError("Please enter the question");
      return;
    }

    const plainAnswer = htmlToPlain(formData.answer);
    if (!plainAnswer || plainAnswer.length < 5) {
      setError("Please provide a meaningful answer (min 5 characters)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        plainText: `${formData.question} ${plainAnswer}`.trim()
      };

      await questionsAPI.create(payload);
      setSuccess(true);

      setTimeout(() => router.push("/questions"), 1200);
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.question || htmlToPlain(formData.answer)) {
      if (window.confirm("Are you sure? Your changes will be lost.")) {
        router.push("/questions");
      }
    } else {
      router.push("/questions");
    }
  };

  const renderPreview = () => (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Preview</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="body1" fontWeight={500}>
                {formData.question || "No question entered"}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
              <Box sx={{ mt: 1 }}>
                <ReactQuillViewer value={formData.answer} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Category sx={{ fontSize: '1rem', color: theme.palette.primary.main }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body2" fontWeight={500}>{formData.category}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: theme.palette.info.main, fontWeight: 600 }}>D</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                <Typography variant="body2" fontWeight={500}>{formData.difficulty}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: "100vh", bgcolor: 'background.default', py: { xs: 2, md: 3 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Button startIcon={<ArrowBack />} onClick={handleCancel} sx={{ mb: 2, textTransform: "none" }}>
              Back
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: theme.palette.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AddCircle sx={{ color: "white", fontSize: "1.5rem" }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                  Add Question
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a new interview question
                </Typography>
              </Box>
            </Box>

            <Paper sx={{ mb: 3, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Tabs value={previewMode ? 1 : 0} onChange={(e, newValue) => setPreviewMode(newValue === 1)}>
                <Tab label="Edit" />
                <Tab label="Preview" />
              </Tabs>
            </Paper>
          </Box>

          {previewMode ? (
            renderPreview()
          ) : (
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }} onClose={() => setError("")}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>Question added successfully!</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Basic Info */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                      Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Category</InputLabel>
                          <Select value={formData.category} label="Category" onChange={(e) => handleChange("category", e.target.value)}>
                            {CATEGORIES.map(cat => <MenuItem key={cat.label} value={cat.label}>{cat.label}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Sub-Category</InputLabel>
                          <Select
                            value={formData.subCategory}
                            label="Sub-Category"
                            onChange={(e) => handleChange("subCategory", e.target.value)}
                          >
                            {CATEGORIES.find(c => c.label === formData.category)?.subCategories
                              .map((sub, i) => (
                                <MenuItem key={i} value={sub}>{sub}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Difficulty</InputLabel>
                          <Select value={formData.difficulty} label="Difficulty" onChange={(e) => handleChange("difficulty", e.target.value)}>
                            {DIFFICULTIES.map(diff => <MenuItem key={diff} value={diff}>{diff}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Question */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      Question
                    </Typography>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={2} 
                      value={formData.question} 
                      onChange={(e) => handleChange("question", e.target.value)} 
                      placeholder="Enter your question here..."
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {formData.question.length}/500 characters
                    </Typography>
                  </Box>

                  {/* Answer */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      Answer
                    </Typography>
                    <Box sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, borderRadius: 1 }}>
                      <ReactQuillEditor value={formData.answer} onChange={(value) => handleChange("answer", value)} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {wordCount} words • Include code examples for clarity
                    </Typography>
                  </Box>

                  {/* Tags */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      Tags (Optional)
                    </Typography>
                    <TextField 
                      fullWidth 
                      value={formData.tags} 
                      onChange={(e) => handleChange("tags", e.target.value)} 
                      placeholder="collections, threading, design-patterns"
                      size="small"
                    />
                    {formData.tags && (
                      <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {formData.tags.split(",").filter(t => t.trim()).map((tag, i) => (
                          <Chip 
                            key={i} 
                            label={tag.trim()} 
                            size="small"
                            onDelete={() => {
                              const tags = formData.tags.split(",").filter(t => t.trim() !== tag.trim());
                              handleChange("tags", tags.join(","));
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                      sx={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => setPreviewMode(true)}
                      startIcon={<Visibility />}
                      sx={{ flex: 1 }}
                    >
                      Preview
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      sx={{ flex: 1 }}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </ProtectedRoute>
  );
}