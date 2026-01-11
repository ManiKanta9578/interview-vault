"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container, Paper, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Alert,
  CircularProgress, Stack, Chip, alpha, Card, Grid, Tabs, Tab, useTheme, InputAdornment, Divider
} from "@mui/material";
import {
  Save, CheckCircle, Help, Visibility, Edit, Terminal, 
  Storage, Close
} from "@mui/icons-material";

import ProtectedRoute from "@/components/ProtectedRoute";
import { questionsAPI, categoryAPI } from "@/lib/api";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";
import ReactQuillViewer from "@/components/editor/ReactQuillViewer";
import DOMPurify from "dompurify";

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function AddQuestionPage() {
  const theme = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    difficulty: "Medium",
    question: "",
    answer: "",
    tags: "",
  });

  const htmlToPlain = (html = "") => {
    if (typeof window === 'undefined') return "";
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
    if (field === "category") {
      const selectedCategory = categories.find(cat => cat.label === value);
      setFormData(prev => ({
        ...prev,
        category: value,
        subCategory: selectedCategory?.subCategories?.[0] || "",
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.question.trim()) {
      setError("Error: Question field cannot be empty");
      return;
    }

    const plainAnswer = htmlToPlain(formData.answer);
    if (!plainAnswer || plainAnswer.length < 5) {
      setError("Error: Answer content is too short (min 5 chars)");
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
      setError(err?.message || "Failed to commit question to database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCats = async () => {
      try {
        let res = await categoryAPI.getAll();
        setCategories(res.data);
        if (res.data && res.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: res.data[0].label,
            subCategory: res.data[0].subCategories?.[0] || ""
          }));
        }
      } catch (error) {
        console.log("Error loading categories", error);
      }
    };
    loadCats();
  }, []);

  const renderMetadataPanel = () => (
    <Paper sx={{ 
      p: 2, mb: 3, 
      bgcolor: alpha(theme.palette.background.paper, 0.4),
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      borderRadius: 2
    }}>
      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', mb: 2, display: 'block' }}>
        // CONFIGURATION
      </Typography>
      
      {/* Responsive Grid: xs=12 (Stack on mobile), md=4 (3 cols on desktop) */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontFamily: 'monospace' }}>CATEGORY</InputLabel>
            <Select
              value={formData.category}
              label="CATEGORY"
              onChange={(e) => handleChange("category", e.target.value)}
              sx={{ fontFamily: 'monospace' }}
            >
              {categories.map(cat => <MenuItem key={cat.id} value={cat.label} sx={{ fontFamily: 'monospace' }}>{cat.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontFamily: 'monospace' }}>SUB_MODULE</InputLabel>
            <Select
              value={formData.subCategory}
              label="SUB_MODULE"
              onChange={(e) => handleChange("subCategory", e.target.value)}
              sx={{ fontFamily: 'monospace' }}
            >
              {categories.find(c => c.label === formData.category)?.subCategories?.map((sub, i) => (
                <MenuItem key={i} value={sub} sx={{ fontFamily: 'monospace' }}>{sub}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontFamily: 'monospace' }}>DIFFICULTY</InputLabel>
            <Select 
              value={formData.difficulty} 
              label="DIFFICULTY" 
              onChange={(e) => handleChange("difficulty", e.target.value)}
              sx={{ fontFamily: 'monospace', color: formData.difficulty === 'Hard' ? 'error.main' : formData.difficulty === 'Medium' ? 'warning.main' : 'success.main' }}
            >
              {DIFFICULTIES.map(diff => <MenuItem key={diff} value={diff} sx={{ fontFamily: 'monospace' }}>{diff}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: "100vh", bgcolor: 'background.default', pb: 8, position: 'relative' }}>
        
        {/* Background Effects */}
        <Box sx={{
          position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <Container maxWidth="lg" sx={{ pt: 4, position: 'relative', zIndex: 1 }}>
          
          {/* Header - "Breadcrumb Path" */}
          {/* Responsive: flexWrap ensures items drop to next line on small screens */}
          <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Terminal sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                  ~/questions/new.md
                </Typography>
                {formData.question && (
                  <Chip 
                    label="Unsaved" 
                    size="small" 
                    sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'warning.main', color: 'warning.contrastText' }} 
                  />
                )}
             </Box>
             <Button 
                startIcon={<Close />} 
                onClick={() => router.push("/questions")}
                sx={{ textTransform: 'none', color: 'text.secondary', fontFamily: 'monospace' }}
             >
               discard_changes()
             </Button>
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(12px)',
              overflow: 'hidden'
            }}
          >
            {/* Editor Tabs */}
            <Box sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
              <Tabs 
                value={previewMode ? 1 : 0} 
                onChange={(e, v) => setPreviewMode(v === 1)}
                variant="scrollable" // Allows scrolling on very small screens
                scrollButtons="auto"
                sx={{ 
                  '& .MuiTab-root': { 
                    fontFamily: 'monospace', 
                    textTransform: 'none',
                    minHeight: 48,
                    fontWeight: 600
                  } 
                }}
              >
                <Tab icon={<Edit fontSize="small" />} iconPosition="start" label="EDIT_MODE" />
                <Tab icon={<Visibility fontSize="small" />} iconPosition="start" label="PREVIEW_OUTPUT" />
              </Tabs>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 4 } }}>
              
              {/* Messages */}
              {error && (
                <Alert severity="error" icon={<Terminal fontSize="inherit" />} sx={{ mb: 3, fontFamily: 'monospace' }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ mb: 3, fontFamily: 'monospace' }}>
                  Success: Question committed to database.
                </Alert>
              )}

              {/* EDITOR MODE */}
              {!previewMode && (
                <Stack spacing={3}>
                  
                  {renderMetadataPanel()}

                  {/* Question Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', mb: 1, color: 'text.secondary' }}>
                      // INPUT: Question Title
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="e.g., Explain the difference between useMemo and useCallback..."
                      value={formData.question}
                      onChange={(e) => handleChange("question", e.target.value)}
                      sx={{ 
                        '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1rem' } 
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mt: 1, alignSelf: 'flex-start' }}>
                            <Help fontSize="small" sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>

                  {/* Answer Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', mb: 1, color: 'text.secondary' }}>
                      // INPUT: Detailed Answer (Markdown/Rich Text)
                    </Typography>
                    <Box sx={{ 
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, 
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.background.default, 0.3),
                      '& .ql-toolbar': { borderTopLeftRadius: 4, borderTopRightRadius: 4, borderColor: alpha(theme.palette.divider, 0.2) },
                      '& .ql-container': { borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderColor: alpha(theme.palette.divider, 0.2), fontFamily: 'monospace' }
                    }}>
                      <ReactQuillEditor value={formData.answer} onChange={(val) => handleChange("answer", val)} />
                    </Box>
                  </Box>

                  {/* Tags */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', mb: 1, color: 'text.secondary' }}>
                      // METADATA: Tags
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="react, hooks, performance (comma separated)"
                      value={formData.tags}
                      onChange={(e) => handleChange("tags", e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Storage fontSize="small" /></InputAdornment>
                      }}
                      sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
                    />
                    {/* Tags wrap naturally */}
                    <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {formData.tags.split(',').filter(t => t.trim()).map((tag, i) => (
                        <Chip 
                          key={i} 
                          label={tag.trim()} 
                          size="small" 
                          onDelete={() => {
                             const newTags = formData.tags.split(',').filter(t => t.trim() !== tag.trim()).join(',');
                             handleChange("tags", newTags);
                          }}
                          sx={{ fontFamily: 'monospace', borderRadius: 1 }} 
                        />
                      ))}
                    </Box>
                  </Box>

                </Stack>
              )}

              {/* PREVIEW MODE */}
              {previewMode && (
                <Box>
                  <Card sx={{ mb: 3, border: `1px dashed ${theme.palette.divider}`, bgcolor: 'transparent' }}>
                    <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.action.hover, 0.05) }}>
                       <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                         PREVIEW: {`${formData.difficulty} | ${formData.category} > ${formData.subCategory}`}
                       </Typography>
                       <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                         {formData.question || "Untitled Question"}
                       </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                       <ReactQuillViewer value={formData.answer} />
                    </Box>
                  </Card>
                </Box>
              )}

              <Divider sx={{ my: 4 }} />

              {/* ACTION BAR */}
              {/* Responsive: flexWrap ensures buttons wrap below text on small screens */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', minWidth: '150px' }}>
                  {wordCount} words • {formData.question.length} chars
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                  <Button 
                    onClick={() => setPreviewMode(!previewMode)}
                    variant="outlined"
                    startIcon={previewMode ? <Edit /> : <Visibility />}
                    sx={{ fontFamily: 'monospace', textTransform: 'none', flexGrow: { xs: 1, sm: 0 } }}
                  >
                    {previewMode ? "return_to_edit()" : "preview_render()"}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
                    sx={{ 
                      fontFamily: 'monospace', 
                      textTransform: 'none', 
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      px: 3,
                      flexGrow: { xs: 1, sm: 0 },
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    {loading ? "committing..." : "git push origin"}
                  </Button>
                </Box>
              </Box>

            </Box>
          </Paper>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}