"use client";;

import { useState } from 'react';
import {
  Box, Paper, Typography, IconButton, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Snackbar, Alert
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function RichContentViewer({ content }) {
  const [copiedId, setCopiedId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  let blocks;

  try {
    blocks = JSON.parse(content);
    if (!Array.isArray(blocks)) {
      blocks = [{ id: '1', type: 'text', content }];
    }
  } catch {
    blocks = [{ id: '1', type: 'text', content }];
  }

  const getLanguageLabel = (lang) => {
    const labels = {
      java: 'Java',
      javascript: 'JavaScript',
      python: 'Python',
      sql: 'SQL',
      bash: 'Bash',
      json: 'JSON',
    };
    return labels[lang] || lang || 'Code';
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setSnackbarOpen(true);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
      {blocks.map((block, index) => (
        <Box key={block.id || index}>
          {block.type === 'text' && (
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.primary' }}
            >
              {block.content}
            </Typography>
          )}

          {block.type === 'code' && (
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#1e1e1e', px: 2, py: 1 }}>
                <Chip
                  label={getLanguageLabel(block.language)}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'monospace' }}
                />
                <IconButton size="small" onClick={() => handleCopyCode(block.content, block.id)} sx={{ color: 'white' }}>
                  {copiedId === block.id ? <Check /> : <ContentCopy />}
                </IconButton>
              </Box>
              <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                <SyntaxHighlighter
                  language={block.language || 'java'}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.875rem' }}
                  showLineNumbers
                >
                  {block.content}
                </SyntaxHighlighter>
              </Box>
            </Paper>
          )}

          {block.type === 'image' && block.content && (
            <Box>
              <Paper elevation={2} sx={{ overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
                <Box component="img" src={block.content} alt={block.caption || 'Answer image'} sx={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
              </Paper>
              {block.caption && (
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                  {block.caption}
                </Typography>
              )}
            </Box>
          )}

          {block.type === 'table' && block.tableData && (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    {block.tableData[0]?.map((_, colIndex) => (
                      <TableCell key={colIndex} sx={{ color: 'white', fontWeight: 600 }}>
                        {block.tableData[0][colIndex] || `Column ${colIndex + 1}`}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {block.tableData.slice(1).map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                        '&:hover': { bgcolor: 'action.selected' },
                      }}
                    >
                      {row.map((cell, colIndex) => (
                        <TableCell key={colIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}