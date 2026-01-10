"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Link from '@tiptap/extension-link';
import { common, createLowlight } from 'lowlight';
import {
  Box, ToggleButton, ToggleButtonGroup, Divider, Select, MenuItem,
  useTheme, alpha
} from '@mui/material';
import {
  FormatBold, FormatItalic, Code, FormatListBulleted,
  FormatListNumbered, FormatQuote, HorizontalRule, Undo, Redo,
  DataObject
} from '@mui/icons-material';

// Initialize syntax highlighting
const lowlight = createLowlight(common);

const MenuBar = ({ editor }) => {
  const theme = useTheme();

  if (!editor) return null;

  return (
    <Box sx={{
      borderBottom: `1px solid ${theme.palette.divider}`,
      p: 1,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      bgcolor: alpha(theme.palette.background.paper, 0.5),
      backdropFilter: 'blur(10px)',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    }}>
      <ToggleButtonGroup size="small" sx={{ bgcolor: 'background.paper' }}>
        <ToggleButton
          value="bold"
          selected={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBold fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="italic"
          selected={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalic fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="code"
          selected={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code (for single words)" // Add tooltip
        >
          <Code fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <ToggleButtonGroup size="small" sx={{ bgcolor: 'background.paper' }}>
        <ToggleButton
          value="codeBlock"
          selected={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block (for snippets)" // Add tooltip
        >
          <DataObject fontSize="small" /> {/* Distinct Icon */}
        </ToggleButton>
        <ToggleButton
          value="bulletList"
          selected={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulleted fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="orderedList"
          selected={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumbered fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ flexGrow: 1 }} />

      <ToggleButtonGroup size="small" sx={{ bgcolor: 'background.paper' }}>
        <ToggleButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo fontSize="small" />
        </ToggleButton>
        <ToggleButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }) {
  const theme = useTheme();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default to use lowlight version
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'java',
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
  });

  // Sync value changes if controlled externally (optional)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // careful with loops here, mainly needed for reset
      if (value === '' || value === '<p></p>') {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  return (
    <Box sx={{
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: alpha(theme.palette.background.default, 0.3),
      overflow: 'hidden',
      '& .ProseMirror': {
        minHeight: '200px',
        padding: 2,
        outline: 'none',
        fontFamily: theme.typography.fontFamily,
        fontSize: '0.95rem',
        color: theme.palette.text.primary,

        // Code Block Styles
        '& pre': {
          background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          color: theme.palette.mode === 'dark' ? '#d4d4d4' : '#333',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontFamily: "'JetBrains Mono', monospace",
          border: `1px solid ${theme.palette.divider}`,
          overflowX: 'auto',

          '& code': {
            color: 'inherit',
            padding: 0,
            background: 'none',
            fontSize: '0.85rem',
          },

          // Syntax highlighting colors (customize as needed)
          '& .hljs-comment, & .hljs-quote': { color: '#6a9955' },
          '& .hljs-variable, & .hljs-template-variable, & .hljs-attribute, & .hljs-tag, & .hljs-name, & .hljs-regexp, & .hljs-link, & .hljs-name, & .hljs-selector-id, & .hljs-selector-class': { color: '#d16969' },
          '& .hljs-number, & .hljs-meta, & .hljs-built_in, & .hljs-builtin-name, & .hljs-literal, & .hljs-type, & .hljs-params': { color: '#b5cea8' },
          '& .hljs-string, & .hljs-symbol, & .hljs-bullet': { color: '#ce9178' },
          '& .hljs-title, & .hljs-section': { color: '#dcdcaa' },
          '& .hljs-keyword, & .hljs-selector-tag': { color: '#569cd6' },
        },

        '& p': { margin: '0.5em 0' },
        '& blockquote': {
          borderLeft: `3px solid ${theme.palette.primary.main}`,
          paddingLeft: '1rem',
          color: 'text.secondary'
        }
      }
    }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </Box>
  );
}