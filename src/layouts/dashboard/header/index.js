import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, IconButton, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
// components
import Iconify from '../../../components/iconify';
import AccountPopover from './AccountPopover';

// ----------------------------------------------------------------------

const NAV_WIDTH = '20%';

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  background: '#fff',
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
  width: '80%',
  marginLeft: NAV_WIDTH,
  zIndex: theme.zIndex.appBar,
  [theme.breakpoints.down('lg')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const [searchMode, setSearchMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {!searchMode ? (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: '48px' }}>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton 
              onClick={() => setSearchMode(true)} 
              sx={{ 
                mr: 4, 
                display: 'flex !important',
                visibility: 'visible !important',
                opacity: 1,
                zIndex: 1000,
              }}
            >
              <SearchIcon sx={{ fontSize: '24px', color: '#333' }} />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Box sx={{ textAlign: 'right', mr: 2 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#333', lineHeight: 1.2 }}>
                  Demo User
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#666', lineHeight: 1.2 }}>
                  User
                </Typography>
              </Box>
              <AccountPopover />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: '48px' }}>
            <InputBase
              autoFocus
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search..."
              sx={{ flex: 1, ml: 2, fontSize: '1rem', background: '#f5f5f5', borderRadius: 2, px: 2, py: 1 }}
            />
            <IconButton 
              onClick={() => setSearchMode(false)} 
              sx={{ 
                ml: 2, 
                display: 'flex !important',
                visibility: 'visible !important',
                opacity: 1,
                zIndex: 1000,
              }}
            >
              <CancelIcon sx={{ fontSize: '24px', color: '#333' }} />
            </IconButton>
          </Box>
        )}
      </StyledToolbar>
    </StyledRoot>
  );
}
