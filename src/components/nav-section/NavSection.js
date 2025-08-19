import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SavingsIcon from '@mui/icons-material/Savings';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
// ----------------------------------------------------------------------

// Navigation UseLocation
import { useLocation } from 'react-router-dom';

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <>
          <NavItem key={item.title} item={item}/>
           {
             item?.children?.map((c) => (
              <SubNavItem key={c.title} item={c}/>
            ))
           }
          </>
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, iconLabel, info } = item;

  const location = useLocation();

  console.log(item.title == "MEDIA");

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        fontSize: '15px',
        width: '100%',
        '& .MuiListItemIcon-root, & .MuiSvgIcon-root': {
          fontSize: '15px',
        },
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.5)',
          width: '100%',
        },
        '&.active': {
          backgroundColor: 'rgba(255,255,255,0.3)',
          fontWeight: 'fontWeightBold',
          width: '100%',
          // borderBottom: path == location.pathname && '2px solid #DC2B8C',
          color: path == location.pathname ? '#DC2B8C' : '#FFFFFF',
        },
      }}
    >
      {iconLabel != 'msg' && iconLabel != 'settings' && (
        <StyledNavItemIcon sx={{ color: 'white', fontSize: '14px', '&.active': { color: 'black', backgroundColor: 'white', fontWeight: 'fontWeightBold' } }}>
          {icon && icon}
        </StyledNavItemIcon>
      )}
      {iconLabel === 'msg' && <StyledNavItemIcon sx={{ color: 'black', fontSize: '14px' }}><MessageIcon /></StyledNavItemIcon>}
      {iconLabel === 'settings' && <StyledNavItemIcon sx={{ color: 'black', fontSize: '14px' }}><SettingsIcon /></StyledNavItemIcon>}

      <ListItemText
        disableTypography
        primary={title}
        sx={{
          color: '#FFFFFF',
          fontSize: '15px',
          fontWeight: 600,
          paddingY: path == location.pathname && '2px',
          paddingX: item.title == 'MEDIA' && '8px',
        }}
      />
      {/* Removed version text from button */}
      {/* {info && info} */}
    </StyledNavItem>
  );
}
function SubNavItem({ item }) {
  const { title, path, icon, info } = item;

  const location = useLocation();

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        fontSize: '12px',
        width: '100%',
        '& .MuiListItemIcon-root, & .MuiSvgIcon-root': {
          fontSize: '12px',
        },
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.5)',
          width: '100%',
        },
        '&.active': {
          backgroundColor: 'rgba(255,255,255,0.5)',
          fontWeight: 'fontWeightBold',
          width: '100%',
        },
      }}
    >
      <StyledNavItemIcon sx={{ color: '#FFFFFF', fontSize: '12px', ml: 5 }}>
        {/* icon rendering if needed */}
      </StyledNavItemIcon>

      <ListItemText disableTypography primary={title} sx={{ color: '#FFFFFF', fontSize: '12px' }} />
      {/* Removed version text from button */}
      {/* {info && info} */}
    </StyledNavItem>
  );
}
