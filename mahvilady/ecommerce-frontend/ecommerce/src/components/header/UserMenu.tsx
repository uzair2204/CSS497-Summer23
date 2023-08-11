import React, { FC } from 'react';
import Menu from "../Menu";
import MenuItem from '@component/MenuItem';
import Icon from '@component/icon/Icon';
import { Small } from '@component/Typography';
import Link from 'next/link';
import { useAppContext } from '@context/AppContext';
import { UserRole } from '@models/user.model';

const list_with_out_login = [
    { title: "Login", icon: "user", url: "/login" },
];

const list_with_login = [
    { title: "Logout", icon: "close", url: "/logout" },
    { title: "View Profile", icon: "dashboard-1", url: "/profile" },
    { title: "Update Password", icon: "shield", url: "/profile/password-change" },
];
const list_with_admin_login = [
    { title: "Logout", icon: "close", url: "/logout" },
    { title: "View Profile", icon: "dashboard-1", url: "/admin-profile" },
    { title: "Update Password", icon: "shield", url: "/admin-profile/password-change" },
];

interface MenuProps {
    handler: any;
}

const UserMenu: FC<MenuProps> = ({ handler }) => {
    const { state } = useAppContext();
    let list;
    if(state?.user?.role === UserRole.ADMIN){
        list=list_with_admin_login;
    }else if(state?.user?.role === UserRole.USER){
        list=list_with_login;
    }else{
        list = list_with_out_login;
    }

    return (
        <Menu
            direction="right"
            handler={handler}
        >
            {list.map((item, id) => (
                <Link href={item.url} key={id}>
                    <MenuItem key={item.title}>
                        <Icon size="28px">{item.icon}</Icon>
                        <Small fontWeight="600">{item.title}</Small>
                    </MenuItem>
                </Link>
            ))}
        </Menu>
    );
};

export default UserMenu;
