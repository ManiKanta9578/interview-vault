// frontend/src/components/editor/ReactQuillEditor.js
"use client";

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
// FIX: Use Named Imports for all Tiptap extensions
import { StarterKit } from '@tiptap/starter-kit';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

import { common, createLowlight } from 'lowlight';
import { 
  Box, ToggleButton, ToggleButtonGroup, Divider, useTheme, alpha 
} from '@mui/material';
import {
  FormatBold, FormatItalic, Code, FormatListBulleted, 
  FormatListNumbered, Undo, Redo, DataObject,
  Image as ImageIcon, TableView, Delete, AddBox
} from '@mui/icons-material';

// Initialize syntax highlighting
const lowlight = createLowlight(common);

const MenuBar = ({ editor }) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  
  if (!editor) return null;

  const addImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editor.chain().focus().setImage({ src: e.target.result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ 
      borderBottom: `1px solid ${theme.palette.divider}`,
      p: 1, display: 'flex', flexWrap: 'wrap', gap: 1,
      bgcolor: alpha(theme.palette.background.paper, 0.5),
      backdropFilter: 'blur(10px)',
      borderTopLeftRadius: 8, borderTopRightRadius: 8
    }}>
      {/* Text Formatting */}
      <ToggleButtonGroup size="small" sx={{ bgcolor: 'background.paper' }}>
        <ToggleButton value="bold" selected={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBold fontSize="small" />
        </ToggleButton>
        <ToggleButton value="italic" selected={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalic fontSize="small" />
        </ToggleButton>
        <ToggleButton value="code" selected={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline Code">
          <Code fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Blocks */}
      <ToggleButtonGroup size="small" sx={{ bgcolor: 'background.paper' }}>
        <ToggleButton value="codeBlock" selected={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
          <DataObject fontSize="small" />
        </ToggleButton>
        <ToggleButton value="bulletList" selected={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FormatListBulleted fontSize="small" />
        </ToggleButton>
        <ToggleButton value="orderedList" selected={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FormatListNumbered fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Insert */}
      <ToggleButtonGroup size="small" sx={{ bgcolor: 'background.paper' }}>
        <ToggleButton value="image" onClick={() => fileInputRef.current.click()} title="Insert Image">
          <ImageIcon fontSize="small" />
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={addImage} />
        </ToggleButton>
        <ToggleButton value="table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
          <TableView fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Table Controls */}
      {editor.isActive('table') && (
        <ToggleButtonGroup size="small" sx={{ bgcolor: 'background.paper', ml: 1 }}>
          <ToggleButton value="addRow" onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row">
            <AddBox fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
          </ToggleButton>
          <ToggleButton value="addCol" onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column">
            <AddBox fontSize="small" />
          </ToggleButton>
          <ToggleButton value="deleteTable" onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table" color="error">
            <Delete fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      )}

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

export default function ReactQuillEditor({ value, onChange, placeholder }) {
  const theme = useTheme();

  const editor = useEditor({
    immediatelyRender: false, 
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'java', HTMLAttributes: { class: 'code-block' } }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
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

  // FIX: Allow populating editor content when data loads
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.getHTML();
      // If editor is effectively empty (just an empty P tag) but value is not, set content.
      // Or if value is explicitly empty string/p tag (clearing).
      if ((currentContent === '<p></p>' && value !== '<p></p>') || value === '' || value === '<p></p>') {
        if (value !== currentContent) {
           editor.commands.setContent(value);
        }
      }
    }
  }, [value, editor]);

  return (
    <Box sx={{ 
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      borderRadius: 2, display: 'flex', flexDirection: 'column',
      bgcolor: alpha(theme.palette.background.default, 0.3), overflow: 'hidden',
      
      '& .ProseMirror': {
        minHeight: '300px', padding: 3, outline: 'none',
        fontFamily: theme.typography.fontFamily, fontSize: '0.95rem', color: theme.palette.text.primary,
        
        '& img': {
          maxWidth: '100%',
          maxHeight: '400px',
          width: 'auto',
          height: 'auto',
          borderRadius: '8px',
          display: 'block',
          margin: '1.5em auto',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: theme.shadows[4]
        },
        '& table': {
          borderCollapse: 'collapse', margin: '1.5em 0', width: '100%', tableLayout: 'fixed', fontSize: '0.9em',
        },
        '& td, & th': {
          border: `1px solid ${theme.palette.divider}`, padding: '8px 12px', verticalAlign: 'top', position: 'relative',
        },
        '& th': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1), fontWeight: 600, textAlign: 'left',
        },
        // IMPROVED: Ensure pre tag (code block) styling in editor matches viewer
        '& pre': {
          background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          color: theme.palette.mode === 'dark' ? '#d4d4d4' : '#333',
          padding: '1rem', borderRadius: '0.5rem',
          fontFamily: "'JetBrains Mono', monospace",
          border: `1px solid ${theme.palette.divider}`, overflowX: 'auto',
          margin: '1em 0',
          '& code': { color: 'inherit', padding: 0, background: 'none', fontSize: '0.85rem' },
          '& .hljs-keyword': { color: '#569cd6' },
        },
        '& p': { margin: '0.5em 0' },
      }
    }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </Box>
  );
}