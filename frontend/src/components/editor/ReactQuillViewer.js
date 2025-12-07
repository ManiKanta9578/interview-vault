"use client";

import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";
import { Paper, Box, useTheme, alpha } from "@mui/material";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import typescript from "highlight.js/lib/languages/typescript";
// Import both dark and light themes
import "highlight.js/styles/atom-one-dark.css";
import "highlight.js/styles/atom-one-light.css";

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);
hljs.registerLanguage('typescript', typescript);

export default function ReactQuillViewer({ 
  value = "", 
  elevation = 0,
  showBorder = true,
  sx = {},
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Find all ql-code-block-container (Quill's code block wrapper)
      const codeContainers = contentRef.current.querySelectorAll('.ql-code-block-container');
      
      codeContainers.forEach((container) => {
        // Skip if already processed
        if (container.dataset.processed) return;
        container.dataset.processed = 'true';
        
        // Get all code lines
        const codeLines = container.querySelectorAll('.ql-code-block');
        let codeText = '';
        let language = 'javascript'; // default language
        
        // Extract code text and language, preserving indentation
        codeLines.forEach((line, index) => {
          // Get innerHTML to preserve spaces and entities
          let lineText = line.innerHTML;
          
          // Decode HTML entities
          const textarea = document.createElement('textarea');
          textarea.innerHTML = lineText;
          lineText = textarea.value;
          
          // Replace <br> with empty string (Quill uses <br> for empty lines)
          if (lineText === '<br>' || lineText.trim() === '') {
            lineText = '';
          }
          
          // Add line to code text
          codeText += lineText + (index < codeLines.length - 1 ? '\n' : '');
          
          // Try to get language from data attribute
          if (line.dataset.language && line.dataset.language !== 'plain') {
            language = line.dataset.language;
          }
        });
        
        // Create wrapper for code block with copy button
        const wrapper = document.createElement('div');
        wrapper.className = 'code-snippet-wrapper';
        wrapper.style.cssText = `
          position: relative;
          margin: 1.5em 0;
          border-radius: 8px;
          overflow: hidden;
          background: ${isDarkMode ? '#1e1e1e' : '#f6f8fa'};
          border: 1px solid ${isDarkMode ? '#30363d' : '#d0d7de'};
          box-shadow: 0 2px 8px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'};
        `;
        
        // Create header with language label and copy button
        const header = document.createElement('div');
        header.className = 'code-snippet-header';
        header.style.cssText = `
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: ${isDarkMode ? '#0d1117' : '#e8eaed'};
          border-bottom: 1px solid ${isDarkMode ? '#30363d' : '#d0d7de'};
        `;
        
        // Language label
        const langLabel = document.createElement('span');
        langLabel.textContent = language.toUpperCase();
        langLabel.style.cssText = `
          font-size: 11px;
          font-weight: 600;
          color: ${isDarkMode ? '#8b949e' : '#57606a'};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Courier New', monospace;
        `;
        
        // Copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span style="margin-left: 4px; font-size: 11px;">Copy</span>
        `;
        copyButton.style.cssText = `
          background: transparent;
          border: 1px solid ${isDarkMode ? '#30363d' : '#d0d7de'};
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          color: ${isDarkMode ? '#8b949e' : '#57606a'};
          display: flex;
          align-items: center;
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 500;
          transition: all 0.2s;
        `;
        
        copyButton.addEventListener('mouseenter', () => {
          copyButton.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
          copyButton.style.borderColor = isDarkMode ? '#58a6ff' : '#0969da';
          copyButton.style.color = isDarkMode ? '#58a6ff' : '#0969da';
        });
        
        copyButton.addEventListener('mouseleave', () => {
          if (!copyButton.classList.contains('copied')) {
            copyButton.style.background = 'transparent';
            copyButton.style.borderColor = isDarkMode ? '#30363d' : '#d0d7de';
            copyButton.style.color = isDarkMode ? '#8b949e' : '#57606a';
          }
        });
        
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(codeText).then(() => {
            copyButton.classList.add('copied');
            copyButton.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span style="margin-left: 4px; font-size: 11px; color: #4caf50;">Copied!</span>
            `;
            copyButton.style.borderColor = '#4caf50';
            copyButton.style.background = 'rgba(76, 175, 80, 0.1)';
            
            setTimeout(() => {
              copyButton.classList.remove('copied');
              copyButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span style="margin-left: 4px; font-size: 11px;">Copy</span>
              `;
              copyButton.style.background = 'transparent';
              copyButton.style.borderColor = isDarkMode ? '#30363d' : '#d0d7de';
              copyButton.style.color = isDarkMode ? '#8b949e' : '#57606a';
            }, 2000);
          });
        });
        
        header.appendChild(langLabel);
        header.appendChild(copyButton);
        
        // Create pre and code elements
        const pre = document.createElement('pre');
        pre.style.cssText = `
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          background: ${isDarkMode ? '#1e1e1e' : '#f6f8fa'} !important;
        `;
        
        const code = document.createElement('code');
        code.className = `language-${language}`;
        code.textContent = codeText;
        code.style.cssText = `
          font-family: 'Courier New', Courier, monospace !important;
          font-size: 13px;
          line-height: 1.6;
          color: ${isDarkMode ? '#c9d1d9' : '#383a42'} !important;
          display: block;
          white-space: pre;
          word-wrap: normal;
          tab-size: 2;
          -moz-tab-size: 2;
          -o-tab-size: 2;
        `;
        
        // Apply syntax highlighting
        try {
          hljs.highlightElement(code);
        } catch (e) {
          console.log('Highlight failed for language:', language);
        }
        
        pre.appendChild(code);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
        
        // Replace old container with new wrapper
        container.parentNode.replaceChild(wrapper, container);
      });
      
      // Also handle old-style pre elements (backwards compatibility)
      const preElements = contentRef.current.querySelectorAll('pre:not([data-processed])');
      preElements.forEach((pre) => {
        if (pre.closest('.code-snippet-wrapper')) return;
        
        pre.dataset.processed = 'true';
        const codeText = pre.textContent || pre.innerText;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'code-snippet-wrapper';
        wrapper.style.cssText = `
          position: relative;
          margin: 1.5em 0;
          border-radius: 8px;
          overflow: hidden;
          background: ${isDarkMode ? '#1e1e1e' : '#f6f8fa'};
          border: 1px solid ${isDarkMode ? '#30363d' : '#d0d7de'};
          box-shadow: 0 2px 8px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'};
        `;
        
        const header = document.createElement('div');
        header.className = 'code-snippet-header';
        header.style.cssText = `
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: ${isDarkMode ? '#0d1117' : '#e8eaed'};
          border-bottom: 1px solid ${isDarkMode ? '#30363d' : '#d0d7de'};
        `;
        
        const langLabel = document.createElement('span');
        langLabel.textContent = 'CODE';
        langLabel.style.cssText = `
          font-size: 11px;
          font-weight: 600;
          color: ${isDarkMode ? '#8b949e' : '#57606a'};
          font-family: 'Courier New', monospace;
        `;
        
        const copyButton = document.createElement('button');
        copyButton.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span style="margin-left: 4px; font-size: 11px;">Copy</span>
        `;
        copyButton.style.cssText = `
          background: transparent;
          border: 1px solid ${isDarkMode ? '#30363d' : '#d0d7de'};
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          color: ${isDarkMode ? '#8b949e' : '#57606a'};
          display: flex;
          align-items: center;
          transition: all 0.2s;
        `;
        
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(codeText);
          copyButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style="margin-left: 4px; font-size: 11px; color: #4caf50;">Copied!</span>
          `;
          setTimeout(() => {
            copyButton.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span style="margin-left: 4px; font-size: 11px;">Copy</span>
            `;
          }, 2000);
        });
        
        header.appendChild(langLabel);
        header.appendChild(copyButton);
        
        const newPre = document.createElement('pre');
        newPre.style.cssText = `
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          background: ${isDarkMode ? '#1e1e1e' : '#f6f8fa'} !important;
        `;
        
        const code = document.createElement('code');
        code.textContent = codeText;
        code.style.cssText = `
          font-family: 'Courier New', Courier, monospace !important;
          font-size: 13px;
          line-height: 1.6;
          color: ${isDarkMode ? '#c9d1d9' : '#24292f'};
        `;
        
        try {
          hljs.highlightElement(code);
        } catch (e) {
          console.log('Highlight failed');
        }
        
        newPre.appendChild(code);
        wrapper.appendChild(header);
        wrapper.appendChild(newPre);
        
        pre.parentNode.replaceChild(wrapper, pre);
      });
    }
  }, [value, isDarkMode]);

  if (!value) {
    return (
      <Paper
        elevation={elevation}
        sx={{
          p: 3,
          borderRadius: 2,
          border: showBorder ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
          ...sx,
        }}
      >
        <Box sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
          No content available
        </Box>
      </Paper>
    );
  }

  const safeHtml = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'span', 'div', 'img'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'spellcheck', 'src', 'alt', 'style', 'data-language'],
  });

  return (
    <Paper
      elevation={elevation}
      sx={{
        p: 3,
        borderRadius: 2,
        border: showBorder ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        ...sx,
      }}
    >
      <Box
        ref={contentRef}
        className="quill-viewer-content"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
        sx={{
          color: isDarkMode ? "#e0e0e0" : "#000000",
          fontSize: "1rem",
          lineHeight: 1.7,
          fontFamily: theme.typography.fontFamily,
          wordBreak: "break-word",
          
          // Typography
          "& p": { marginBottom: "1em", "&:last-child": { marginBottom: 0 } },
          "& h1": {
            fontSize: "2em",
            fontWeight: 700,
            marginBottom: "0.5em",
            marginTop: "0.5em",
            color: isDarkMode ? "#e0e0e0" : "#000000",
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            paddingBottom: "0.3em",
          },
          "& h2": {
            fontSize: "1.5em",
            fontWeight: 700,
            marginBottom: "0.5em",
            marginTop: "0.5em",
            color: isDarkMode ? "#e0e0e0" : "#000000",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            paddingBottom: "0.3em",
          },
          "& h3": {
            fontSize: "1.25em",
            fontWeight: 700,
            marginBottom: "0.5em",
            marginTop: "0.5em",
            color: isDarkMode ? "#e0e0e0" : "#000000",
          },
          "& strong": { fontWeight: 700, color: isDarkMode ? "#ffffff" : "#000000" },
          "& em": { fontStyle: "italic" },
          "& u": { textDecoration: "underline" },
          "& ul, & ol": { paddingLeft: "2em", marginBottom: "1em" },
          "& li": { marginBottom: "0.5em" },
          "& a": {
            color: isDarkMode ? "#58a6ff" : "#0969da",
            textDecoration: "none",
            fontWeight: 500,
            "&:hover": { textDecoration: "underline" },
          },
          
          // Inline code
          "& p code, & li code, & td code, & h1 code, & h2 code, & h3 code": {
            backgroundColor: isDarkMode ? "#0d1117" : "#f6f8fa",
            color: isDarkMode ? "#ff7b72" : "#cf222e",
            padding: "3px 6px",
            borderRadius: "4px",
            fontSize: "0.9em",
            fontFamily: "'Courier New', Courier, monospace",
            border: `1px solid ${isDarkMode ? "#30363d" : "#d0d7de"}`,
            fontWeight: 500,
          },
          
          // Blockquotes
          "& blockquote": {
            borderLeft: `4px solid ${isDarkMode ? "#424242" : theme.palette.primary.main}`,
            paddingLeft: "16px",
            marginLeft: 0,
            marginRight: 0,
            marginBottom: "1em",
            color: isDarkMode ? "#b0b0b0" : "#666666",
            fontStyle: "italic",
            backgroundColor: isDarkMode ? alpha("#424242", 0.1) : alpha(theme.palette.primary.main, 0.05),
            padding: "12px 16px",
            borderRadius: "0 4px 4px 0",
          },
          
          // Scrollbar
          "& pre::-webkit-scrollbar": { height: "8px" },
          "& pre::-webkit-scrollbar-track": {
            backgroundColor: isDarkMode ? "#0d1117" : "#f6f8fa",
            borderRadius: "4px",
          },
          "& pre::-webkit-scrollbar-thumb": {
            backgroundColor: isDarkMode ? "#30363d" : "#d0d7de",
            borderRadius: "4px",
            "&:hover": { backgroundColor: isDarkMode ? "#484f58" : "#a8b1bb" },
          },
          
          // Override highlight.js
          "& .hljs": { 
            background: "transparent !important",
            color: isDarkMode ? "#c9d1d9 !important" : "#383a42 !important",
          },
          
          // Light mode syntax highlighting overrides
          ...(!isDarkMode && {
            "& .hljs-keyword": { color: "#a626a4 !important" },
            "& .hljs-string": { color: "#50a14f !important" },
            "& .hljs-comment": { color: "#a0a1a7 !important", fontStyle: "italic" },
            "& .hljs-number": { color: "#986801 !important" },
            "& .hljs-function": { color: "#4078f2 !important" },
            "& .hljs-title": { color: "#4078f2 !important" },
            "& .hljs-params": { color: "#383a42 !important" },
            "& .hljs-built_in": { color: "#c18401 !important" },
            "& .hljs-literal": { color: "#0184bb !important" },
            "& .hljs-attr": { color: "#986801 !important" },
            "& .hljs-variable": { color: "#e45649 !important" },
            "& .hljs-tag": { color: "#e45649 !important" },
            "& .hljs-name": { color: "#e45649 !important" },
            "& .hljs-selector-tag": { color: "#e45649 !important" },
            "& .hljs-selector-id": { color: "#4078f2 !important" },
            "& .hljs-selector-class": { color: "#c18401 !important" },
            "& .hljs-operator": { color: "#383a42 !important" },
            "& .hljs-regexp": { color: "#50a14f !important" },
            "& .hljs-meta": { color: "#4078f2 !important" },
          }),
          
          // Dark mode syntax highlighting (already applied by atom-one-dark)
          ...(isDarkMode && {
            "& .hljs-keyword": { color: "#c678dd !important" },
            "& .hljs-string": { color: "#98c379 !important" },
            "& .hljs-comment": { color: "#5c6370 !important", fontStyle: "italic" },
            "& .hljs-number": { color: "#d19a66 !important" },
            "& .hljs-function": { color: "#61afef !important" },
            "& .hljs-title": { color: "#61afef !important" },
            "& .hljs-params": { color: "#abb2bf !important" },
            "& .hljs-built_in": { color: "#e6c07b !important" },
            "& .hljs-literal": { color: "#56b6c2 !important" },
            "& .hljs-attr": { color: "#d19a66 !important" },
            "& .hljs-variable": { color: "#e06c75 !important" },
            "& .hljs-tag": { color: "#e06c75 !important" },
            "& .hljs-name": { color: "#e06c75 !important" },
          }),
        }}
      />
    </Paper>
  );
}

ReactQuillViewer.propTypes = {
  value: PropTypes.string,
  elevation: PropTypes.number,
  showBorder: PropTypes.bool,
  sx: PropTypes.object,
};