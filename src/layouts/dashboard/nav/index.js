import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';

// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import Image from "../../../assets/bridgetechlogo.png";
import CMCLOGO from '../../../assets/images/CMCNetwork-logo.png';
import { fontFamily } from '@mui/system';

import {AiOutlineLock} from 'react-icons/ai'

// ----------------------------------------------------------------------

// const NAV_WIDTH = 280;
const NAV_WIDTH = '20%';


const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 0, display: 'flex', justifyContent: 'center' }}>
        <img src={Image} alt="Bridgetech Logo" style={{ maxWidth: '110px', marginTop: '8px' }} />
      </Box>

      <Box sx={{ mb: 5, mt: -3, mx: 2.5,display:'flex',justifyContent:"center" }}>
        <Link underline="none">
          {/* <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#FFFFFF' }}>
                {account.displayName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'red' }}>
                {account.role}
              </Typography>
            </Box>
          </StyledAccount> */}
          {/*<img src={CMCLOGO} onClick={()=>{navigate('/dashboard/home')}} />*/}
        </Link>
      </Box>

      <NavSection
        data={navConfig}
        sx={{
          '& .MuiListItem-root': {
            fontSize: '0.5rem',
            padding: '7px 14px',
            marginBottom: 0,
            borderBottom: 'none',
            transition: 'background 0.2s, color 0.2s',
            color: '#b0b0b0',
          },
          '& .Mui-selected, & .Mui-selected:hover': {
            background: 'rgba(128,128,128,0.6)',
            color: '#fff',
          },
        }}
      />
      {/*<span style={{color:"white", 
                    fontSize:"1.2rem",
                   position:'relative',
                   top:'-92px',
                   left:'45%'
                   
                   }}><AiOutlineLock/>
        </span>*/}
     
      <Box sx={{ flexGrow: 1 }} />

   
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
         <>
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              // bgcolor: 'background.default',
              // bgcolor: '#60A1EC',
              bgcolor: 'black',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}

        </Drawer>,
        
        </>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
          
        </Drawer>
      )}
    </Box>
  );
}
