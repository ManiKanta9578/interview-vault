"use client";

import { Box, Paper } from '@mui/material';
import 'highlight.js/styles/vs2015.css'; 

export default function UnifiedViewer({ content }) {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2,
        '& p': {
          margin: '0.5em 0',
          lineHeight: 1.8,
        },
        '& h1': {
          fontSize: '2em',
          fontWeight: 600,
          margin: '0.5em 0',
          color: 'text.primary',
        },
        '& h2': {
          fontSize: '1.5em',
          fontWeight: 600,
          margin: '0.5em 0',
          color: 'text.primary',
        },
        '& ul, & ol': {
          paddingLeft: '1.5em',
          margin: '0.5em 0',
        },
        '& li': {
          margin: '0.25em 0',
        },
        '& blockquote': {
          borderLeft: '3px solid #1976d2',
          paddingLeft: '1em',
          marginLeft: 0,
          fontStyle: 'italic',
          color: 'text.secondary',
          backgroundColor: '#f5f5f5',
          padding: '0.5em 1em',
          borderRadius: '4px',
        },
        '& code': {
          backgroundColor: '#f5f5f5',
          padding: '0.2em 0.4em',
          borderRadius: '3px',
          fontSize: '0.9em',
          fontFamily: 'monospace',
          color: '#e01e5a',
        },
        '& pre': {
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1em',
          borderRadius: '8px',
          overflow: 'auto',
          margin: '1em 0',
          '& code': {
            backgroundColor: 'transparent',
            padding: 0,
            color: 'inherit',
          },
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          margin: '1em 0',
          boxShadow: 2,
        },
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          margin: '1em 0',
          boxShadow: 1,
          '& td, & th': {
            border: '1px solid #ddd',
            padding: '0.75em',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: '#1976d2',
            color: 'white',
            fontWeight: 600,
          },
          '& tr:nth-of-type(even)': {
            backgroundColor: '#f9f9f9',
          },
          '& tr:hover': {
            backgroundColor: '#f0f0f0',
          },
        },
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}