import SvgColor from '../../../components/svg-color';
 import { FaUser } from "react-icons/fa";
 import { FaRegAddressCard } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
 import { IoIosSettings } from "react-icons/io";

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'USERS',
    path: '/dashboard/home',
    icon: <FaUser />
  },
  {
    title: 'CARDS',
    path: '/dashboard/artists',
    icon: <FaRegAddressCard/>
  },
  {
    title: `NEWSLETTERS`,
    path: '/dashboard/media',
    icon: <FaRegNewspaper />,
  },
  {
    title: `SETTINGS`,
    path: '/dashboard/settings',
    icon: <IoIosSettings/>,
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
