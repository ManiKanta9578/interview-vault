"use client";

import { useState } from 'react';
import {
  Box, Paper, Button, ButtonGroup, TextField, Select, MenuItem,
  IconButton, Typography, Divider, FormControl, InputLabel,
  Stack, Chip, Alert
} from '@mui/material';
import {
  TextFields, Code, Image, TableChart, ArrowUpward,
  ArrowDownward, Delete, Add
} from '@mui/icons-material';

export default function RichContentEditor({ value, onChange }) {
  const [blocks, setBlocks] = useState(() => {
    if (!value) return [{ id: Date.now().toString(), type: 'text', content: '' }];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [{ id: Date.now().toString(), type: 'text', content: '' }];
    } catch {
      return [{ id: Date.now().toString(), type: 'text', content: value }];
    }
  });

  const [uploadError, setUploadError] = useState('');

  const updateBlocks = (newBlocks) => {
    setBlocks(newBlocks);
    onChange(JSON.stringify(newBlocks));
  };

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      ...(type === 'code' && { language: 'java' }),
      ...(type === 'table' && { rows: 2, cols: 2, tableData: [['', ''], ['', '']] })
    };
    updateBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    updateBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id) => {
    if (blocks.length === 1) return;
    updateBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  const handleImageUpload = (blockId, file) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateBlock(blockId, { content: reader.result });
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const updateTableCell = (blockId, row, col, value) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableData) return;

    const newTableData = block.tableData.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? value : c))
    );
    updateBlock(blockId, { tableData: newTableData });
  };

  const addTableRow = (blockId) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableData) return;

    const cols = block.tableData[0]?.length || 2;
    const newRow = Array(cols).fill('');
    updateBlock(blockId, { 
      tableData: [...block.tableData, newRow],
      rows: (block.rows || 2) + 1
    });
  };

  const addTableColumn = (blockId) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableData) return;

    const newTableData = block.tableData.map(row => [...row, '']);
    updateBlock(blockId, { 
      tableData: newTableData,
      cols: (block.cols || 2) + 1
    });
  };

  const deleteTableRow = (blockId, rowIndex) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableData || block.tableData.length <= 1) return;

    const newTableData = block.tableData.filter((_, i) => i !== rowIndex);
    updateBlock(blockId, { 
      tableData: newTableData,
      rows: (block.rows || 2) - 1
    });
  };

  return (
    <Box>
      {uploadError && (
        <Alert severity="error" onClose={() => setUploadError('')} sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      <Stack spacing={3}>
        {blocks.map((block, index) => (
          <Paper key={block.id} elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Chip
                icon={
                  block.type === 'text' ? <TextFields /> :
                  block.type === 'code' ? <Code /> :
                  block.type === 'image' ? <Image /> :
                  <TableChart />
                }
                label={block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                color="primary"
                variant="outlined"
              />
              
              <Box>
                {index > 0 && (
                  <IconButton size="small" onClick={() => moveBlock(block.id, 'up')}>
                    <ArrowUpward />
                  </IconButton>
                )}
                {index < blocks.length - 1 && (
                  <IconButton size="small" onClick={() => moveBlock(block.id, 'down')}>
                    <ArrowDownward />
                  </IconButton>
                )}
                {blocks.length > 1 && (
                  <IconButton size="small" color="error" onClick={() => deleteBlock(block.id)}>
                    <Delete />
                  </IconButton>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {block.type === 'text' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Enter text content..."
                variant="outlined"
              />
            )}

            {block.type === 'code' && (
              <Stack spacing={2}>
                <FormControl size="small" sx={{ width: 200 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={block.language || 'java'}
                    label="Language"
                    onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                  >
                    <MenuItem value="java">Java</MenuItem>
                    <MenuItem value="javascript">JavaScript</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="sql">SQL</MenuItem>
                    <MenuItem value="bash">Bash</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="// Enter code here..."
                  variant="outlined"
                  sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.875rem' } }}
                />
              </Stack>
            )}

            {block.type === 'image' && (
              <Stack spacing={2}>
                {!block.content ? (
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(block.id, file);
                      };
                      input.click();
                    }}
                  >
                    <Image sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography>Click to upload image</Typography>
                    <Typography variant="caption" color="text.secondary">
                      PNG, JPG up to 5MB
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box
                      component="img"
                      src={block.content}
                      alt="Preview"
                      sx={{ maxWidth: '100%', height: 'auto', borderRadius: 2, border: 1, borderColor: 'divider' }}
                    />
                    <Button size="small" color="error" onClick={() => updateBlock(block.id, { content: '' })}>
                      Remove Image
                    </Button>
                    <TextField
                      fullWidth
                      size="small"
                      value={block.caption || ''}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      placeholder="Add image caption (optional)"
                      variant="outlined"
                    />
                  </>
                )}
              </Stack>
            )}

            {block.type === 'table' && block.tableData && (
              <Stack spacing={2}>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {block.tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={cell}
                                onChange={(e) => updateTableCell(block.id, rowIndex, colIndex, e.target.value)}
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                              />
                            </td>
                          ))}
                          <td style={{ padding: '4px' }}>
                            {block.tableData && block.tableData.length > 1 && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => deleteTableRow(block.id, rowIndex)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
                <ButtonGroup size="small" variant="outlined">
                  <Button startIcon={<Add />} onClick={() => addTableRow(block.id)}>
                    Add Row
                  </Button>
                  <Button startIcon={<Add />} onClick={() => addTableColumn(block.id)}>
                    Add Column
                  </Button>
                </ButtonGroup>
              </Stack>
            )}
          </Paper>
        ))}
      </Stack>

      <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add Content Block
        </Typography>
        <ButtonGroup variant="contained" size="large">
          <Button startIcon={<TextFields />} onClick={() => addBlock('text')}>
            Text
          </Button>
          <Button startIcon={<Code />} onClick={() => addBlock('code')}>
            Code
          </Button>
          <Button startIcon={<Image />} onClick={() => addBlock('image')}>
            Image
          </Button>
          <Button startIcon={<TableChart />} onClick={() => addBlock('table')}>
            Table
          </Button>
        </ButtonGroup>
      </Paper>
    </Box>
  );
}