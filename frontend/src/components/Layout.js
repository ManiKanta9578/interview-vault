import { Box } from '@mui/material';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
}