import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoPricetagOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuLayoutDashboard } from 'react-icons/lu';
import user from '../../../public/sidebar-icon/user.svg';
import earings from '../../../public/sidebar-icon/earings.svg';
import agency from '../../../public/sidebar-icon/agency.svg';
import category from '../../../public/sidebar-icon/category.svg';

import about from '../../../public/sidebar-icon/about.svg';
import privacy from '../../../public/sidebar-icon/privacy.svg';
import terms from '../../../public/sidebar-icon/terms.svg';

import { CiLock, CiLogout, CiUser } from 'react-icons/ci';
import './SiderbarDublicate.css';
import { MdKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { TbAlpha } from 'react-icons/tb';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

const menuItems = [
    { label: 'Dashboard', path: '/', icon: <LuLayoutDashboard size={24} /> },
    { label: 'User', path: '/users', icon: <img src={user} alt="user" width={28} height={28} /> },
    { label: 'Earing', path: '/earing', icon: <img src={earings} alt="earing" width={24} height={24} /> },
    { label: 'Agency', path: '/agency', icon: <img src={agency} alt="agency" width={24} height={24} /> },
    { label: 'Brand', path: '/brand', icon: <img src={category} alt="brand" width={24} height={24} /> },
    { label: 'Category', path: '/category', icon: <TbAlpha size={24} /> },
    {
        label: 'User Approvals',
        path: '/request-approval',
        icon: <RiVerifiedBadgeFill className="text-gray-400" size={24} />,
    },
];

const settings = [
    {
        label: 'Setting',
        icon: <IoSettingsOutline size={24} />,
        path: '/profile',
        children: [
            { label: 'Profile', path: '/profile', icon: <CiUser size={24} /> },
            { label: 'Change Password', path: '/change-password', icon: <CiLock size={24} /> },
            { label: 'Marketplace Fees', path: '/marketplace-fees', icon: <IoPricetagOutline size={24} /> },
            { label: 'About Us', path: '/about-us', icon: <img src={about} width={24} height={24} alt="about" /> },

            {
                label: 'Privacy Policy',
                path: '/terms-policy',
                icon: <img src={privacy} width={24} height={24} alt="policy" />,
            },
            {
                label: 'Terms And Condition',
                path: '/terms-condition',
                icon: <img src={terms} width={24} height={24} alt="terms" />,
            },
        ],
    },
];

export default function SiderbarDublicate() {
    const location = useLocation();
    const navigate = useNavigate();
    const [settingIcon, setSettingIcon] = useState<boolean>(false);
    const [isSetting, setIsSetting] = useState<boolean>(false);

    const getMenuItemClass = (path: string) => {
        return location.pathname === path && 'active';
    };

    const handleSetting = () => {
        setIsSetting(!isSetting);
        setSettingIcon(!settingIcon);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <Link to="/">
                <div className="text-[#757575] text-[70px] font-bold text-center">
                    <h1>SELE</h1>
                </div>
            </Link>
            <div className="navigation mt-5">
                <ul className="menu ml-6">
                    {menuItems.map((item) => (
                        <li key={item.path} className={`menu-item ${getMenuItemClass(item.path)}`}>
                            <b></b>
                            <b></b>
                            <Link to={item.path} className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="icon ">{item.icon}</span>
                                        <span className=" text-[#333333]  ">{item.label}</span>
                                    </div>
                                </div>
                            </Link>
                            <br />
                        </li>
                    ))}

                    {/* setting pages */}
                    <li onClick={handleSetting} className={`menu-item  cursor-pointer`}>
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <span className="icon flex items-center">{<IoSettingsOutline size={24} />}</span>
                                <span className=" text-[#333]">Settings</span>
                            </div>
                            <p className="">{settingIcon ? <MdKeyboardArrowDown /> : <MdOutlineKeyboardArrowUp />}</p>
                        </div>
                        <br />
                        {isSetting && (
                            <ul className="submenu ml-5 mb-4">
                                {settings?.[0].children.map(
                                    (item: { label: string; path: string; icon: JSX.Element }) => {
                                        return (
                                            <li
                                                key={item.path}
                                                className={`submenu-item px-4 mb-2  ${getMenuItemClass(item.path)}`}
                                            >
                                                <Link to={item.path} onClick={(e) => e.stopPropagation()}>
                                                    <span className="icon">{item.icon}</span>
                                                    <span className="title">{item.label}</span>
                                                </Link>
                                            </li>
                                        );
                                    },
                                )}
                            </ul>
                        )}
                    </li>

                    <li className={`menu-item cursor-pointer mt-[10%]`}>
                        <div
                            className="flex items-center justify-center gap-3 border border-gray-400 py-2 px-1 rounded-xl"
                            onClick={handleLogout}
                        >
                            <CiLogout className="font-bold " size={23} />
                            <span className=" text-[#333]">Logout</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
