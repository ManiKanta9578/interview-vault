"use client";

import React, { useMemo } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; 

const repairCodeBlocks = (html) => {
  if (typeof window === 'undefined') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const codeLines = Array.from(doc.querySelectorAll('p > code:only-child'));
  
  if (codeLines.length === 0) return html;

  for (let i = 0; i < codeLines.length; i++) {
    const codeTag = codeLines[i];
    const pTag = codeTag.parentElement;
    const prevP = pTag.previousElementSibling;
    const isStartOfBlock = !prevP || !prevP.querySelector('code:only-child');

    if (isStartOfBlock) {
      let currentP = pTag;
      let codeContent = [];
      let nodesToRemove = [];

      while (currentP && currentP.querySelector('code:only-child')) {
        codeContent.push(currentP.querySelector('code').textContent);
        nodesToRemove.push(currentP);
        currentP = currentP.nextElementSibling;
      }

      if (codeContent.length > 0) {
        const pre = doc.createElement('pre');
        const code = doc.createElement('code');
        code.className = 'language-java'; 
        code.textContent = codeContent.join('\n');
        pre.appendChild(code);
        pTag.parentNode.replaceChild(pre, pTag);
        nodesToRemove.slice(1).forEach(node => node.remove());
        i += nodesToRemove.length - 1;
      }
    }
  }
  return doc.body.innerHTML;
};

export default function RichTextViewer({ value }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const processedHtml = useMemo(() => {
    const repaired = repairCodeBlocks(value || "");
    return DOMPurify.sanitize(repaired, {
      // --- ADD TABLE & IMG TAGS HERE ---
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", 
        "ul", "ol", "li", "blockquote", "pre", "code", "a", "span", 
        "img", "table", "thead", "tbody", "tr", "th", "td" // <--- Added these
      ],
      ALLOWED_ATTR: [
        "href", "target", "rel", "class", "src", "alt", "style", 
        "width", "height", "colspan", "rowspan" // <--- Added table attrs
      ],
    });
  }, [value]);

  React.useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [processedHtml]);

  return (
    <Box sx={{
      fontFamily: theme.typography.fontFamily,
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: theme.palette.text.primary,

      '& p': { marginBottom: '1em' },

      // --- Image Rendering ---
      '& img': {
        maxWidth: '100%',        // Prevents horizontal overflow
        maxHeight: '500px',      // Larger limit for viewing vs editing
        width: 'auto',           // Maintain aspect ratio
        height: 'auto',          // Maintain aspect ratio
        borderRadius: '8px',
        display: 'block',
        margin: '1.5em auto',    // Center horizontally
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: theme.shadows[4]
      },

      // --- Table Rendering (Developer Style) ---
      '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '1.5em 0',
        fontSize: '0.9em',
        borderRadius: '6px',
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      },
      '& th': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        color: theme.palette.text.primary,
        fontWeight: 600,
        textAlign: 'left',
        padding: '12px 16px',
        borderBottom: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
        fontFamily: "'JetBrains Mono', monospace", // Dev look for headers
      },
      '& td': {
        padding: '12px 16px',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: theme.palette.text.secondary,
      },
      '& tr:last-child td': {
        borderBottom: 'none',
      },
      '& tr:hover td': {
        backgroundColor: alpha(theme.palette.action.hover, 0.05),
      },

      // --- Existing Code Block Styles ---
      '& :not(pre) > code': {
        fontFamily: "'JetBrains Mono', monospace",
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        padding: '0.2em 0.4em', borderRadius: '4px', fontSize: '0.85em',
      },
      '& pre': {
        position: 'relative',
        backgroundColor: isDark ? '#0d1117' : '#f6f8fa',
        border: `1px solid ${isDark ? '#30363d' : '#e1e4e8'}`,
        borderRadius: '8px', padding: '16px', overflowX: 'auto',
        marginBottom: '1.5em', marginTop: '1em',
        fontFamily: "'JetBrains Mono', monospace",
        '& code': {
          backgroundColor: 'transparent', color: 'inherit', padding: 0,
          fontSize: '0.9em', display: 'block', overflowX: 'auto',
        },
      },
      '& ul, & ol': { paddingLeft: '1.5em', marginBottom: '1em' },
      '& li': { marginBottom: '0.5em' },
    }}>
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </Box>
  );
}