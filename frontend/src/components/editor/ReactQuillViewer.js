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

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("typescript", typescript);

export default function ReactQuillViewer({
  value = "",
  elevation = 0,
  showBorder = true,
  sx = {},
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    /** ------------------------------------------------------
     * PROCESS QUILL CODE BLOCKS
     * ------------------------------------------------------ */
    const containers = contentRef.current.querySelectorAll(
      ".ql-code-block-container"
    );

    containers.forEach((container) => {
      if (container.dataset.processed) return;
      container.dataset.processed = "true";

      const lines = container.querySelectorAll(".ql-code-block");

      let codeText = "";
      let language = "java";

      lines.forEach((line, index) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = line.innerHTML;
        let text = textarea.value;

        if (text === "<br>" || text.trim() === "") text = "";

        codeText += text + (index < lines.length - 1 ? "\n" : "");

        if (line.dataset.language && line.dataset.language !== "plain") {
          language = line.dataset.language;
        }
      });

      /** ---------------------
       * CREATE CODE SNIPPET WRAPPER
       * --------------------- */
      const wrapper = document.createElement("div");
      wrapper.className = "code-snippet-wrapper";
      wrapper.style.cssText = `
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        background: ${isDarkMode ? "#1e1e1e" : "#f6f8fa"};
        border: 1px solid ${isDarkMode ? "#30363d" : "#d0d7de"};
        margin: 12px 0;
      `;

      const header = document.createElement("div");
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: ${isDarkMode ? "#0d1117" : "#e8eaed"};
        border-bottom: 1px solid ${isDarkMode ? "#30363d" : "#d0d7de"};
      `;

      const langLabel = document.createElement("span");
      langLabel.textContent = language.toUpperCase();
      langLabel.style.cssText = `
        font-size: 11px;
        font-weight: 600;
        color: ${isDarkMode ? "#8b949e" : "#57606a"};
        font-family: 'Courier New', monospace;
      `;

      /** ---------------------
       * COPY BUTTON
       * --------------------- */
      const copyButton = document.createElement("button");
      copyButton.className = "copy-code-button";
      copyButton.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span style="margin-left: 4px; font-size: 11px;">Copy</span>
      `;

      copyButton.style.cssText = `
        background: transparent;
        border: 1px solid ${isDarkMode ? "#30363d" : "#d0d7de"};
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        color: ${isDarkMode ? "#8b949e" : "#57606a"};
        display: flex;
        align-items: center;
        transition: all 0.2s;
      `;

      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(codeText).then(() => {
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
          }, 1800);
        });
      });

      header.appendChild(langLabel);
      header.appendChild(copyButton);

      /** ---------------------
       * CODE BLOCK
       * --------------------- */
      const pre = document.createElement("pre");
      pre.style.cssText = `
        margin: 0;
        padding: 16px;
        overflow-x: auto;
        background: ${isDarkMode ? "#1e1e1e" : "#f6f8fa"} !important;
      `;

      const code = document.createElement("code");
      code.className = `language-${language}`;
      code.textContent = codeText;
      code.style.cssText = `
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
      `;

      /** ---------------------
       * HIGHLIGHT.JS FIX
       * --------------------- */
      try {
        hljs.highlightElement(code);
        code.classList.add("hljs"); // 🔥 REQUIRED FOR COLORING
      } catch (e) {
        console.warn("Highlight.js failed:", language);
      }

      pre.appendChild(code);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      container.parentNode.replaceChild(wrapper, container);
    });
  }, [value, isDarkMode]);

  /** ------------------------------------------------------
   * SANITIZE HTML
   * ------------------------------------------------------ */
  const safeHtml = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "strike",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
      "span",
      "div",
      "img",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "class",
      "spellcheck",
      "src",
      "alt",
      "style",
      "data-language",
      "data-list",
      "contenteditable",
    ],
  });

  /** ------------------------------------------------------
   * MAIN RENDER
   * ------------------------------------------------------ */
  return (
    <Paper
      elevation={elevation}
      sx={{
        p: 3,
        borderRadius: 2,
        border: showBorder
          ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
          : "none",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        ...sx,
      }}
    >
      <Box
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
        sx={{
          color: isDarkMode ? "#e0e0e0" : "#000",
          fontSize: "1rem",
          lineHeight: 1.7,

          "& ul, & ol": {
            marginLeft: "1.5rem",
            paddingLeft: "1.2rem",
          },
          "& li": {
            marginBottom: "4px",
            lineHeight: 1.6,
          },

          /** ------------------------------
           * DYNAMIC HIGHLIGHT.JS STYLES
           * ------------------------------ */
          "& .hljs": {
            background: "transparent !important",
            color: isDarkMode ? "#c9d1d9" : "#383a42",
          },

          /** LIGHT THEME */
          ...(!isDarkMode && {
            "& .hljs-keyword": { color: "#a626a4" },
            "& .hljs-string": { color: "#50a14f" },
            "& .hljs-number": { color: "#986801" },
            "& .hljs-comment": { color: "#a0a1a7", fontStyle: "italic" },
            "& .hljs-title": { color: "#4078f2" },
            "& .hljs-variable": { color: "#e45649" },
          }),

          /** DARK THEME */
          ...(isDarkMode && {
            "& .hljs-keyword": { color: "#c678dd" },
            "& .hljs-string": { color: "#98c379" },
            "& .hljs-number": { color: "#d19a66" },
            "& .hljs-comment": { color: "#5c6370", fontStyle: "italic" },
            "& .hljs-title": { color: "#61afef" },
            "& .hljs-variable": { color: "#e06c75" },
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
