import SvgColor from '../../../components/svg-color';
import { FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Users',
    path: '/dashboard/home',
    icon: <FaUser style={{ fontSize: '14px' }} />
  },
  {
    title: 'Cards',
    path: '/dashboard/artists',
    icon: <MdDashboard style={{ fontSize: '14px' }} />
  },
  {
    title: `Newsletters`,
    path: '/dashboard/media',
    icon: <MdEmail style={{ fontSize: '14px' }} />,
  },
  {
    title: `Settings`,
    path: '/dashboard/settings',
    icon: <IoIosSettings style={{ fontSize: '14px' }} />,
  },
//   {
//     title: 'MUSIC BRIEFS',
//    path: '/dashboard/music-brief',
//     icon:<AiOutlineInbox/>
    
// },
//   {
//     title: 'ONE ON ONES',
//     path: '/dashboard/one-on-one',
//     icon:<AiOutlineBulb/>,
//   },
 
];

export default navConfig;
