"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
    Box, Paper, IconButton, Divider, Tooltip,
    TextField, Button, Stack, Typography, ButtonGroup
} from '@mui/material';
import {
    FormatBold, FormatItalic, FormatUnderlined, Code,
    FormatListBulleted, FormatListNumbered, FormatQuote,
    Image as ImageIcon, TableChart, Undo, Redo,
    Title, Notes, CodeOff
} from '@mui/icons-material';
import { useCallback } from 'react';
import { Table } from '@tiptap/extension-table';


export default function UnifiedEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value || '<p>Start writing your answer here...</p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        immediatelyRender: false,
    });

    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB');
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    editor.chain().focus().setImage({ src: reader.result }).run();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }, [editor]);

    const addTable = useCallback(() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <Box>
            {/* Toolbar */}
            <Paper elevation={1} sx={{ p: 1, mb: 1, position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {/* Text Formatting */}
                    <ButtonGroup size="small" variant="outlined">
                        <Tooltip title="Bold (Ctrl+B)">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                color={editor.isActive('bold') ? 'primary' : 'default'}
                                size="small"
                            >
                                <FormatBold />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Italic (Ctrl+I)">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                color={editor.isActive('italic') ? 'primary' : 'default'}
                                size="small"
                            >
                                <FormatItalic />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Underline">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                color={editor.isActive('strike') ? 'primary' : 'default'}
                                size="small"
                            >
                                <FormatUnderlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Inline Code">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleCode().run()}
                                color={editor.isActive('code') ? 'primary' : 'default'}
                                size="small"
                            >
                                <Code />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>

                    <Divider orientation="vertical" flexItem />

                    {/* Headings */}
                    <ButtonGroup size="small" variant="outlined">
                        <Tooltip title="Heading 1">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
                                size="small"
                            >
                                <Title />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Heading 2">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
                                size="small"
                            >
                                <Typography variant="h6" component="span">H2</Typography>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Paragraph">
                            <IconButton
                                onClick={() => editor.chain().focus().setParagraph().run()}
                                color={editor.isActive('paragraph') ? 'primary' : 'default'}
                                size="small"
                            >
                                <Notes />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>

                    <Divider orientation="vertical" flexItem />

                    {/* Lists */}
                    <ButtonGroup size="small" variant="outlined">
                        <Tooltip title="Bullet List">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                color={editor.isActive('bulletList') ? 'primary' : 'default'}
                                size="small"
                            >
                                <FormatListBulleted />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Numbered List">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                color={editor.isActive('orderedList') ? 'primary' : 'default'}
                                size="small"
                            >
                                <FormatListNumbered />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Blockquote">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                color={editor.isActive('blockquote') ? 'primary' : 'default'}
                                size="small"
                            >
                                <FormatQuote />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>

                    <Divider orientation="vertical" flexItem />

                    {/* Code Block */}
                    <ButtonGroup size="small" variant="outlined">
                        <Tooltip title="Code Block">
                            <IconButton
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                color={editor.isActive('codeBlock') ? 'primary' : 'default'}
                                size="small"
                            >
                                <CodeOff />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>

                    <Divider orientation="vertical" flexItem />

                    {/* Insert */}
                    <ButtonGroup size="small" variant="outlined">
                        <Tooltip title="Insert Image">
                            <IconButton onClick={addImage} size="small">
                                <ImageIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert Table">
                            <IconButton onClick={addTable} size="small">
                                <TableChart />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>

                    <Divider orientation="vertical" flexItem />

                    {/* Undo/Redo */}
                    <ButtonGroup size="small" variant="outlined">
                        <Tooltip title="Undo (Ctrl+Z)">
                            <IconButton
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                                size="small"
                            >
                                <Undo />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Redo (Ctrl+Y)">
                            <IconButton
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                                size="small"
                            >
                                <Redo />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                </Stack>

                {/* Table Controls (show when table is active) */}
                {editor.isActive('table') && (
                    <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => editor.chain().focus().addColumnBefore().run()}
                            >
                                Add Column Before
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => editor.chain().focus().addColumnAfter().run()}
                            >
                                Add Column After
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                            >
                                Delete Column
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => editor.chain().focus().addRowBefore().run()}
                            >
                                Add Row Before
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                            >
                                Add Row After
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => editor.chain().focus().deleteRow().run()}
                            >
                                Delete Row
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => editor.chain().focus().deleteTable().run()}
                            >
                                Delete Table
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Paper>

            {/* Editor Content */}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    minHeight: 400,
                    '& .ProseMirror': {
                        minHeight: 350,
                        outline: 'none',
                        '& p': {
                            margin: '0.5em 0',
                        },
                        '& h1': {
                            fontSize: '2em',
                            fontWeight: 600,
                            margin: '0.5em 0',
                        },
                        '& h2': {
                            fontSize: '1.5em',
                            fontWeight: 600,
                            margin: '0.5em 0',
                        },
                        '& ul, & ol': {
                            paddingLeft: '1.5em',
                            margin: '0.5em 0',
                        },
                        '& blockquote': {
                            borderLeft: '3px solid #ddd',
                            paddingLeft: '1em',
                            marginLeft: 0,
                            fontStyle: 'italic',
                            color: '#666',
                        },
                        '& code': {
                            backgroundColor: '#f5f5f5',
                            padding: '0.2em 0.4em',
                            borderRadius: '3px',
                            fontSize: '0.9em',
                            fontFamily: 'monospace',
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
                        },
                        '& table': {
                            borderCollapse: 'collapse',
                            width: '100%',
                            margin: '1em 0',
                            '& td, & th': {
                                border: '1px solid #ddd',
                                padding: '0.5em',
                                textAlign: 'left',
                            },
                            '& th': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 600,
                            },
                        },
                    },
                }}
            >
                <EditorContent editor={editor} />
            </Paper>

            {/* Help Text */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                💡 Tip: Use keyboard shortcuts like Ctrl+B for bold, Ctrl+I for italic. Click toolbar buttons to insert images and tables.
            </Typography>
        </Box>
    );
}