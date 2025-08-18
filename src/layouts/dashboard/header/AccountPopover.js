import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Grid } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
// mocks_
import account from '../../../_mock/account';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'src/redux/actions/auth.action';
import { useNavigate } from 'react-router-dom';
import randomGuy from 'src/assets/images/random-guy.jpg'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          zIndex: 1000,
          position: 'relative',
          '&:hover': {
            backgroundColor: 'transparent',
          },
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={user?user.imageUrl:randomGuy} alt="photoURL" />
      </IconButton>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 200,
            zIndex: 9999,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
              display: 'block',
              width: '100%',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
        }}
        sx={{
          zIndex: 9999,
        }}
      >
        <MenuItem onClick={handleClose} sx={{ m: 1, display: 'block', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Iconify icon="eva:person-fill" sx={{ mr: 1 }} />
            My Profile
          </Box>
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ m: 1, display: 'block', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Iconify icon="eva:email-fill" sx={{ mr: 1 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem onClick={() => dispatch(logout(navigate))} sx={{ m: 1, display: 'block', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Iconify icon="eva:log-out-fill" sx={{ mr: 1 }} />
            Logout
          </Box>
        </MenuItem>
      </Popover>
    </>
  );
}
