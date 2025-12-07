"use client";


import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Box, Paper, Stack, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel,
  Button, Typography
} from "@mui/material";
import {
  FormatBold, FormatItalic, FormatListBulleted, Code as CodeIcon,
  ContentCopy, TextFields, FormatQuote, Title
} from "@mui/icons-material";

/**
 * Languages shown in the selector
 */
const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
  { id: "json", label: "JSON" },
];

export default function TiptapTextCodeEditor({ value = "", onChange, placeholder = "Write theory and code..." }) {
  const [selectedLang, setSelectedLang] = useState("javascript");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // allow codeBlock from StarterKit? StarterKit has codeBlock but we'll use CodeBlockLowlight
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "<p></p>",
    onUpdate({ editor: ed }) {
      // Send HTML upstream
      const html = ed.getHTML();
      if (onChange) onChange(html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
        spellCheck: "true",
      },
    },
    immediatelyRender: false,
  }, [selectedLang]);

  useEffect(() => {
    if (!editor) return;
    const ext = editor.extensionManager.extensions.find(e => e.name === "codeBlockLowlight");
    if (ext && ext.options) {
    }
  }, [selectedLang, editor]);

  if (!editor) return null;

  // Toolbar helpers
  const execCommand = (cb) => {
    if (!editor) return;
    editor.chain().focus()[cb]().run();
  };

  const toggleCodeBlock = () => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
  };

  const copyCodeBlock = (codeText) => {
    navigator.clipboard.writeText(codeText).catch(() => { /* ignore */ });
  };

  const getActiveCodeBlockText = () => {
    if (!editor) return "";
    const state = editor.state;
    const { selection } = state;
    const { from, to } = selection;
    let code = "";
    state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === "codeBlock") {
        code = node.textContent;
      }
    });
    return code;
  };

  const handleLanguageChange = (e) => {
    setSelectedLang(e.target.value);
    if (!editor) return;
    editor.chain().focus().setCodeBlock({ language: e.target.value }).run();
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 1, mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Bold">
            <IconButton size="small" onClick={() => execCommand("toggleBold")}>
              <FormatBold />
            </IconButton>
          </Tooltip>

          <Tooltip title="Italic">
            <IconButton size="small" onClick={() => execCommand("toggleItalic")}>
              <FormatItalic />
            </IconButton>
          </Tooltip>

          <Tooltip title="Bullet list">
            <IconButton size="small" onClick={() => execCommand("toggleBulletList")}>
              <FormatListBulleted />
            </IconButton>
          </Tooltip>

          <Tooltip title="Blockquote">
            <IconButton size="small" onClick={() => execCommand("toggleBlockquote")}>
              <FormatQuote />
            </IconButton>
          </Tooltip>

          <Tooltip title="Heading">
            <IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Title />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle code block">
            <IconButton size="small" onClick={toggleCodeBlock}>
              <CodeIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ flex: 1 }} />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="code-lang-label">Code language</InputLabel>
            <Select
              labelId="code-lang-label"
              value={selectedLang}
              label="Code language"
              onChange={handleLanguageChange}
              size="small"
            >
              {LANGUAGES.map((l) => (
                <MenuItem key={l.id} value={l.id}>{l.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper elevation={1}>
        <Box sx={{ p: 2 }}>
          <EditorContent editor={editor} />
        </Box>
      </Paper>

      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" color="text.secondary">Selected code block:</Typography>
        <Button
          size="small"
          startIcon={<ContentCopy />}
          onClick={() => {
            const text = getActiveCodeBlockText();
            if (text) copyCodeBlock(text);
          }}
        >
          Copy
        </Button>
      </Box>
    </Box>
  );
}

TiptapTextCodeEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};
