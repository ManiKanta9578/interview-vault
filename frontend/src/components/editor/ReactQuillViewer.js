"use client";

import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { Box, useTheme, alpha } from "@mui/material";
import hljs from "highlight.js";

// Register minimal languages needed
hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
hljs.registerLanguage("python", require("highlight.js/lib/languages/python"));
hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"));
hljs.registerLanguage("typescript", require("highlight.js/lib/languages/typescript"));

export default function ReactQuillViewer({
  value = "",
  elevation = 0,
  showBorder = true,
  sx = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Process code blocks
    const containers = contentRef.current.querySelectorAll(".ql-code-block-container");
    
    containers.forEach((container) => {
      if (container.dataset.processed) return;
      container.dataset.processed = "true";

      const lines = container.querySelectorAll(".ql-code-block");
      let codeText = "";
      let language = "java";

      lines.forEach((line, idx) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = line.innerHTML;
        const text = textarea.value === "<br>" ? "" : textarea.value;
        codeText += text + (idx < lines.length - 1 ? "\n" : "");
        
        if (line.dataset.language && line.dataset.language !== "plain") {
          language = line.dataset.language;
        }
      });

      // Create code block wrapper
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        margin: 12px 0;
        background: ${isDark ? "#1e1e1e" : "#f8f9fa"};
        border: 1px solid ${isDark ? "#2d333b" : "#e1e4e8"};
      `;

      // Header with language and copy button
      const header = document.createElement("div");
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: ${isDark ? "#161b22" : "#f6f8fa"};
        border-bottom: 1px solid ${isDark ? "#2d333b" : "#e1e4e8"};
      `;

      const langLabel = document.createElement("span");
      langLabel.textContent = language;
      langLabel.style.cssText = `
        font-size: 12px;
        font-weight: 500;
        color: ${isDark ? "#8b949e" : "#6e7781"};
        font-family: 'SF Mono', monospace;
      `;

      // Copy button
      const copyBtn = document.createElement("button");
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      copyBtn.style.cssText = `
        background: transparent;
        border: 1px solid ${isDark ? "#2d333b" : "#d0d7de"};
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        color: ${isDark ? "#8b949e" : "#6e7781"};
        display: flex;
        align-items: center;
        transition: all 0.2s;
      `;

      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(codeText);
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 1500);
      });

      header.appendChild(langLabel);
      header.appendChild(copyBtn);

      // Code content
      const pre = document.createElement("pre");
      pre.style.cssText = `
        margin: 0;
        padding: 12px;
        overflow-x: auto;
        font-size: 13px;
        line-height: 1.5;
        background: transparent !important;
      `;

      const code = document.createElement("code");
      code.className = `language-${language}`;
      code.textContent = codeText;
      code.style.fontFamily = "'SF Mono', 'Courier New', monospace";

      try {
        hljs.highlightElement(code);
      } catch (e) {
        console.warn("Highlight failed:", language);
      }

      pre.appendChild(code);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      container.parentNode.replaceChild(wrapper, container);
    });
  }, [value, isDark]);

  // Sanitize HTML
  const safeHtml = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", 
      "h4", "h5", "h6", "ul", "ol", "li", "blockquote", 
      "pre", "code", "a", "span", "div", "img"
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "class", "src", "alt", "style",
      "data-language", "data-list"
    ],
  });

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1.5,
        border: showBorder ? `1px solid ${alpha(theme.palette.divider, 0.08)}` : 'none',
        bgcolor: isDark ? 'grey.900' : 'background.paper',
        fontSize: '0.9rem',
        lineHeight: 1.6,
        ...sx,
      }}
    >
      <Box
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
        sx={{
          color: 'text.primary',
          
          // Basic typography
          "& p": {
            margin: '0 0 0.75rem 0',
          },
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            margin: '1.5rem 0 0.75rem 0',
            fontWeight: 600,
          },
          "& ul, & ol": {
            margin: '0 0 0.75rem 1.5rem',
          },
          "& li": {
            marginBottom: '0.25rem',
          },
          "& blockquote": {
            margin: '0.75rem 0',
            paddingLeft: '1rem',
            borderLeft: `3px solid ${theme.palette.divider}`,
            color: 'text.secondary',
          },
          "& a": {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          
          // Syntax highlighting
          "& .hljs": {
            background: 'transparent',
          },
          "& .hljs-keyword": { color: isDark ? '#c678dd' : '#d73a49' },
          "& .hljs-string": { color: isDark ? '#98c379' : '#032f62' },
          "& .hljs-number": { color: isDark ? '#d19a66' : '#005cc5' },
          "& .hljs-comment": { 
            color: isDark ? '#5c6370' : '#6a737d',
            fontStyle: 'italic'
          },
          "& .hljs-title": { color: isDark ? '#61afef' : '#6f42c1' },
          "& .hljs-variable": { color: isDark ? '#e06c75' : '#e36209' },
        }}
      />
    </Box>
  );
}