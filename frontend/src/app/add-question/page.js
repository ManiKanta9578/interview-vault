"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container, Paper, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Alert,
  CircularProgress, Stack, Divider, Chip, alpha, Card, Fade, Zoom, Avatar, InputAdornment, Grid, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab
} from "@mui/material";
import {
  Save, ArrowBack, AddCircle, CheckCircle, Category, AutoFixHigh, LocalOffer, Timer,
  BarChart, Help, ExpandMore, Visibility, Preview, Edit, ContentCopy, QuestionAnswer
} from "@mui/icons-material";

import ProtectedRoute from "@/components/ProtectedRoute";
import { questionsAPI } from "@/lib/api";
import { useTheme, useMediaQuery } from "@mui/material";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";
import ReactQuillViewer from "@/components/editor/ReactQuillViewer";

import DOMPurify from "dompurify";

const CATEGORIES = [
  { label: 'All', icon: 'ðŸ“š', count: 0 },
  { label: 'Core Java', icon: 'â˜•', count: 45, color: '#FF6B6B' },
  { label: 'Collections', icon: 'ðŸ“¦', count: 32, color: '#4ECDC4' },
  { label: 'Multithreading', icon: 'âš¡', count: 28, color: '#45B7D1' },
  { label: 'Spring Boot', icon: 'ðŸƒ', count: 38, color: '#96CEB4' },
  { label: 'Microservices', icon: 'ðŸ”§', count: 42, color: '#FFEAA7' },
  { label: 'Database & JPA', icon: 'ðŸ—„ï¸', count: 35, color: '#DDA0DD' },
  { label: 'Algorithms', icon: 'ðŸ’¡', count: 52, color: '#FFA726' }
];

const DIFFICULTIES = [
  { label: 'All', count: 0 },
  { label: 'Easy', count: 85, color: '#4CAF50' },
  { label: 'Medium', count: 145, color: '#FF9800' },
  { label: 'Hard', count: 70, color: '#F44336' }
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Difficulty: Easy to Hard', value: 'easy-first' },
  { label: 'Difficulty: Hard to Easy', value: 'hard-first' },
  { label: 'Most Viewed', value: 'popular' }
];

export default function AddQuestionPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const [formData, setFormData] = useState({
    category: "Core Java",
    difficulty: "Medium",
    question: "",
    answer: "<p>Start writing your answer here...</p>",
    tags: "",
    explanation: "",
    complexity: "",
    followUp: "",
    resources: "",
    estimatedTime: "15"
  });

  // helper: sanitize & strip tags to get plain text for counts/validation/search
  const htmlToPlain = (html = "") => {
    const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    // collapse whitespace and decode basic entities if necessary
    return clean.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  };

  useEffect(() => {
    const plainAnswer = htmlToPlain(formData.answer);
    const plainQuestion = formData.question.trim();
    const totalPlain = `${plainQuestion} ${plainAnswer}`.trim();
    const totalWords = totalPlain ? totalPlain.split(/\s+/).filter(Boolean).length : 0;
    const totalChars = totalPlain.length;
    setWordCount(totalWords);
    setCharCount(totalChars);
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
      // Server should still sanitize / validate. We send HTML, but server must enforce rules.
      const payload = {
        ...formData,
        // also store a plain text copy for search/indexing on the server
        plainText: `${formData.question} ${plainAnswer}`.trim()
      };

      const res = await questionsAPI.create(payload);
      setSuccess(true);

      // short redirect — keep it simple
      setTimeout(() => router.push("/questions"), 1200);
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err?.message || "Failed to add question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.question || (htmlToPlain(formData.answer))) {
      if (window.confirm("Are you sure? Your changes will be lost.")) {
        router.push("/questions");
      }
    } else {
      router.push("/questions");
    }
  };

  const getCategoryColor = () => {
    const category = CATEGORIES.find(c => c.value === formData.category);
    return category ? category.color : theme.palette.primary.main;
  };

  const getDifficultyColor = () => {
    const difficulty = DIFFICULTIES.find(d => d.value === formData.difficulty);
    return difficulty ? difficulty.color : theme.palette.primary.main;
  };

  const renderPreview = () => (
    <Fade in={previewMode} timeout={300}>
      <Box>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `2px solid ${alpha(theme.palette.divider, 0.2)}`, bgcolor: theme.palette.background.default, mb: 3 }}>
          {/* header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <QuestionAnswer sx={{ color: theme.palette.primary.main, fontSize: "2rem" }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="primary">Question Preview</Typography>
              <Typography variant="caption" color="text.secondary">How it will appear to users</Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Help sx={{ color: theme.palette.primary.main }} /> Question
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                  {formData.question || "No question entered"}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`, bgcolor: alpha(theme.palette.success.main, 0.03) }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle sx={{ color: theme.palette.success.main }} /> Answer
                </Typography>

                {/* Use the viewer to render sanitized HTML (keeps formatting & code blocks) */}
                <Box sx={{ mt: 1 }}>
                  <ReactQuillViewer value={formData.answer} />
                </Box>
              </Card>
            </Grid>

            {/* Category / Difficulty cards omitted for brevity — use your existing markup */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(getCategoryColor(), 0.1), color: getCategoryColor(), width: 48, height: 48 }}>
                    {CATEGORIES.find(c => c.value === formData.category)?.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Category</Typography>
                    <Typography fontWeight={600}>{formData.category}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(getDifficultyColor(), 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h5" sx={{ color: getDifficultyColor() }}>{DIFFICULTIES.find(d => d.value === formData.difficulty)?.icon}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                    <Typography fontWeight={600}>{formData.difficulty}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: "100vh", background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`, py: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Header & Tabs (kept same as your original) */}
          <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
            <Button startIcon={<ArrowBack />} onClick={handleCancel} sx={{ mb: 3, borderRadius: 3, textTransform: "none", fontWeight: 600, color: "text.secondary" }}>
              Back to Questions
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Box sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}` }}>
                <AddCircle sx={{ color: "white", fontSize: { xs: "2rem", sm: "3rem" } }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" }, fontWeight: 800, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 1 }}>
                  Create Interview Question
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  Write both question and answer in one unified interface
                </Typography>
              </Box>
            </Box>

            <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, background: theme.palette.background.paper }}>
              <Tabs value={previewMode ? 1 : 0} onChange={(e, newValue) => setPreviewMode(newValue === 1)} sx={{ '& .MuiTab-root': { textTransform: "none", fontWeight: 600, fontSize: "0.95rem", py: 2 } }}>
                <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Edit /> Edit Mode</Box>} />
                <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Preview /> Live Preview</Box>} />
              </Tabs>
            </Paper>
          </Box>

          {previewMode ? (
            renderPreview()
          ) : (
            <Box sx={{ display: "flex", gap: { xs: 0, md: 4 }, flexDirection: { xs: "column", md: "row" } }}>
              {/* Main form */}
              <Box sx={{ flex: 1 }}>
                <Fade in={!previewMode} timeout={500}>
                  <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 4, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, background: theme.palette.background.paper, boxShadow: "0 8px 32px rgba(0,0,0,0.04)", position: "relative" }}>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError("")}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}> <Typography fontWeight={600}>🎉 Question added successfully!</Typography><Typography variant="body2">Redirecting to questions page...</Typography></Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                      <Stack spacing={4}>
                        {/* Basic info, question input (same as your original) */}
                        <Box>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                            <Category sx={{ color: theme.palette.primary.main }} /> Basic Information
                          </Typography>

                          <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select value={formData.category} label="Category" onChange={(e) => handleChange("category", e.target.label)} sx={{ borderRadius: 3 }}>
                                  {CATEGORIES.map(cat => <MenuItem key={cat.label} value={cat.label}>{cat.label}</MenuItem>)}
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth required>
                                <InputLabel>Difficulty</InputLabel>
                                <Select value={formData.difficulty} label="Difficulty" onChange={(e) => handleChange("difficulty", e.target.label)} sx={{ borderRadius: 3 }}>
                                  {DIFFICULTIES.map(diff => <MenuItem key={diff.label} value={diff.label}>{diff.label}</MenuItem>)}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Question section */}
                        <Box>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                            <Help sx={{ color: theme.palette.primary.main }} /> Question
                          </Typography>
                          <TextField fullWidth required multiline rows={3} value={formData.question} onChange={(e) => handleChange("question", e.target.value)} placeholder="Enter a clear and specific interview question..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, fontSize: "1.1rem" } }} InputProps={{ startAdornment: <InputAdornment position="start"><QuestionAnswer sx={{ color: theme.palette.text.secondary }} /></InputAdornment> }} helperText="Be specific and include context when needed" />
                          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">{formData.question.length}/500 characters</Typography>
                            <Typography variant="caption" color={formData.question.length > 400 ? "warning.main" : "text.secondary"}>{Math.ceil(formData.question.split(" ").length / 200 * 100)}% complete</Typography>
                          </Box>
                        </Box>

                        {/* Answer Section (editor) */}
                        <Box>
                          <Box sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, borderRadius: 3, overflow: "hidden", mb: 2 }}>
                            <ReactQuillEditor value={formData.answer} onChange={(value) => handleChange("answer", value)} />
                            <Box sx={{ p: 2 }}>
                              <Button variant="text" onClick={() => console.log(formData.answer)}>Log HTML</Button>
                              <Button variant="text" onClick={() => console.log(htmlToPlain(formData.answer))}>Log Plain</Button>
                            </Box>
                          </Box>

                          <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.1)}` }}>
                            <Typography variant="caption" color="text.secondary">💡 Tip: Include code examples, diagrams, and real-world scenarios for better understanding.</Typography>
                          </Box>
                        </Box>

                        {/* Additional fields & action buttons (kept similar to yours) */}
                        <Accordion elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, '&:before': { display: "none" } }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}><LocalOffer sx={{ color: theme.palette.warning.main }} /> Additional Information (Optional)</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Stack spacing={3}>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Tags</Typography>
                                <TextField fullWidth value={formData.tags} onChange={(e) => handleChange("tags", e.target.value)} placeholder="collections, threading, design-patterns" InputProps={{ startAdornment: <InputAdornment position="start"><LocalOffer sx={{ color: theme.palette.text.secondary }} /></InputAdornment>, sx: { borderRadius: 3 } }} />
                                {formData.tags && <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>{formData.tags.split(",").filter(t => t.trim()).map((tag, i) => (<Chip key={i} label={tag.trim()} size="small" onDelete={() => {
                                  const tags = formData.tags.split(",").filter(t => t.trim() !== tag.trim());
                                  handleChange("tags", tags.join(","));
                                }} sx={{ borderRadius: 2 }} />))}</Box>}
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Explanation & Context</Typography>
                                <TextField fullWidth multiline rows={3} value={formData.explanation} onChange={(e) => handleChange("explanation", e.target.value)} placeholder="Add background context, common mistakes, or alternative approaches..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Complexity Analysis</Typography>
                                <TextField fullWidth multiline rows={2} value={formData.complexity} onChange={(e) => handleChange("complexity", e.target.value)} placeholder="Time complexity: O(n), Space complexity: O(1)..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                              </Box>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button variant="outlined" onClick={handleCancel} disabled={loading} sx={{ borderRadius: 3, px: 4, py: 1.5, textTransform: "none", fontWeight: 600 }}>Cancel</Button>
                            <Button variant="outlined" onClick={() => setPreviewMode(true)} startIcon={<Visibility />} sx={{ borderRadius: 3, px: 4, py: 1.5, textTransform: "none", fontWeight: 600 }}>Preview</Button>
                          </Box>

                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} sx={{ borderRadius: 3, px: 4, py: 1.5, textTransform: "none", fontWeight: 600 }}>
                              {loading ? "Adding Question..." : "Save Question"}
                            </Button>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  </Paper>
                </Fade>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
