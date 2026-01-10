"use client";

import React, { useMemo } from 'react';
import { Box, useTheme, alpha, IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Ensure you import a style

// Function to repair "p > code" lines into "pre > code" blocks
const repairCodeBlocks = (html) => {
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all paragraphs that ONLY contain a code tag
  const codeLines = Array.from(doc.querySelectorAll('p > code:only-child'));
  
  if (codeLines.length === 0) return html;

  // Iterate and merge consecutive lines
  for (let i = 0; i < codeLines.length; i++) {
    const codeTag = codeLines[i];
    const pTag = codeTag.parentElement;
    
    // Check if this is the start of a block (prev sibling is not a code-p)
    const prevP = pTag.previousElementSibling;
    const isStartOfBlock = !prevP || !prevP.querySelector('code:only-child');

    if (isStartOfBlock) {
      // Collect all consecutive code lines
      let currentP = pTag;
      let codeContent = [];
      let nodesToRemove = [];

      while (currentP && currentP.querySelector('code:only-child')) {
        // Extract text, handling encoded entities
        codeContent.push(currentP.querySelector('code').textContent);
        nodesToRemove.push(currentP);
        currentP = currentP.nextElementSibling;
      }

      // If we found more than 1 line, or if it's a significant single line
      if (codeContent.length > 0) {
        // Create new Pre/Code block
        const pre = doc.createElement('pre');
        const code = doc.createElement('code');
        code.className = 'language-java'; // Default fallback
        code.textContent = codeContent.join('\n');
        pre.appendChild(code);

        // Replace the first P with the new PRE
        pTag.parentNode.replaceChild(pre, pTag);

        // Remove the other absorbed P tags
        nodesToRemove.slice(1).forEach(node => node.remove());
        
        // Skip index forward
        i += nodesToRemove.length - 1;
      }
    }
  }

  return doc.body.innerHTML;
};

export default function RichTextViewer({ value }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // 1. Repair HTML structure (p > code -> pre > code)
  // 2. Sanitize for security
  const processedHtml = useMemo(() => {
    const repaired = repairCodeBlocks(value || "");
    return DOMPurify.sanitize(repaired);
  }, [value]);

  // 3. Apply Syntax Highlighting after render
  React.useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [processedHtml]);

  return (
    <Box sx={{
      // Global Text Styles
      fontFamily: theme.typography.fontFamily,
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: theme.palette.text.primary,

      '& p': { marginBottom: '1em' },
      
      // Inline Code (Single words)
      '& :not(pre) > code': {
        fontFamily: "'JetBrains Mono', monospace",
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        padding: '0.2em 0.4em',
        borderRadius: '4px',
        fontSize: '0.85em',
      },

      // Code Blocks (The terminal view)
      '& pre': {
        position: 'relative',
        backgroundColor: isDark ? '#0d1117' : '#f6f8fa',
        border: `1px solid ${isDark ? '#30363d' : '#e1e4e8'}`,
        borderRadius: '8px',
        padding: '16px',
        overflowX: 'auto',
        marginBottom: '1.5em',
        marginTop: '1em',
        fontFamily: "'JetBrains Mono', monospace",
        
        '& code': {
          backgroundColor: 'transparent',
          color: 'inherit',
          padding: 0,
          fontSize: '0.9em',
          display: 'block',
          overflowX: 'auto',
        },
      },

      // Lists
      '& ul, & ol': { paddingLeft: '1.5em', marginBottom: '1em' },
      '& li': { marginBottom: '0.5em' },
    }}>
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </Box>
  );
}