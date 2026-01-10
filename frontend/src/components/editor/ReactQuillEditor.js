"use client";

import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { Box, useTheme } from "@mui/material";
import "quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function ReactQuillEditor({
  value,
  onChange,
  placeholder = "Write your answer here...",
  readOnly = false,
  height = 400,
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const modules = React.useMemo(() => ({
    toolbar: readOnly ? false : [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["code-block"],
      ["link"],
      ["clean"],
    ],
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function() {
            // Insert spaces for tab in code blocks
            return true;
          }
        }
      }
    }
  }), [readOnly]);

  const formats = [
    "header", "bold", "italic", "underline",
    "list", "code-block", "link",
  ];

  return (
    <Box
      sx={{
        "& .ql-container": {
          minHeight: height,
          fontSize: "1rem",
          fontFamily: theme.typography.fontFamily,
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
          color: isDarkMode ? "#e0e0e0" : "#000000",
          border: `1px solid ${isDarkMode ? "#424242" : "#e0e0e0"}`,
          borderRadius: "0 0 8px 8px",
        },
        "& .ql-editor": {
          minHeight: height,
          padding: "16px",
          color: isDarkMode ? "#e0e0e0" : "#000000",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        },
        "& .ql-editor.ql-blank::before": {
          color: isDarkMode ? "#888888" : "#aaaaaa",
          fontStyle: "italic",
        },
        "& .ql-toolbar": {
          backgroundColor: isDarkMode ? "#2d2d2d" : "#f5f5f5",
          border: `1px solid ${isDarkMode ? "#424242" : "#e0e0e0"}`,
          borderRadius: "8px 8px 0 0",
        },
        "& .ql-stroke": {
          stroke: isDarkMode ? "#e0e0e0" : "#444444",
        },
        "& .ql-fill": {
          fill: isDarkMode ? "#e0e0e0" : "#444444",
        },
        "& .ql-picker-label": {
          color: isDarkMode ? "#e0e0e0" : "#444444",
        },
        "& .ql-picker-options": {
          backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
          border: `1px solid ${isDarkMode ? "#424242" : "#e0e0e0"}`,
        },
        "& .ql-picker-item": {
          color: isDarkMode ? "#e0e0e0" : "#444444",
        },
        "& .ql-toolbar button:hover": {
          backgroundColor: isDarkMode ? "#404040" : "#e0e0e0",
        },
        "& .ql-toolbar button.ql-active": {
          backgroundColor: isDarkMode ? "#1976d2" : "#1976d2",
        },
        "& .ql-toolbar button.ql-active .ql-stroke": {
          stroke: "#ffffff",
        },
        "& .ql-toolbar button.ql-active .ql-fill": {
          fill: "#ffffff",
        },
        "& .ql-editor pre.ql-syntax": {
          backgroundColor: isDarkMode ? "#0d1117" : "#f6f8fa",
          color: isDarkMode ? "#c9d1d9" : "#24292f",
          padding: "12px",
          borderRadius: "6px",
          overflow: "auto",
          whiteSpace: "pre",
          tabSize: 2,
          MozTabSize: 2,
        },
        "& .ql-editor code": {
          backgroundColor: isDarkMode ? "#0d1117" : "#f6f8fa",
          color: isDarkMode ? "#c9d1d9" : "#24292f",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "0.9em",
        },
        "& .ql-editor a": {
          color: isDarkMode ? "#58a6ff" : "#0969da",
        },
        "& .ql-editor h1, & .ql-editor h2, & .ql-editor h3": {
          color: isDarkMode ? "#e0e0e0" : "#000000",
        },
        "& .ql-editor ul, & .ql-editor ol": {
          paddingLeft: "1.5em",
        },
        "& .ql-editor blockquote": {
          borderLeft: `4px solid ${isDarkMode ? "#424242" : "#e0e0e0"}`,
          paddingLeft: "16px",
          color: isDarkMode ? "#b0b0b0" : "#666666",
        },
      }}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
      />
    </Box>
  );
}

ReactQuillEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  height: PropTypes.number,
};