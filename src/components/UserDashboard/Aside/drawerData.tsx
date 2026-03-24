// src/dashboard/UserDashboard/aside/drawerData.ts

import {
  FaHome,
  FaClipboardList,
  FaBoxOpen,
  FaHeart,
  FaGift,
  FaMoneyBillWave,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export interface DrawerItem {
  id: string;
  name: string;
  icon: IconType;
  link?: string;
  action?: "logout";
}

export const userDrawerData: DrawerItem[] = [
  {
    id: "home",
    name: "Home",
    icon: FaHome,
    link: "/dashboard",
  },
  {
    id: "orders",
    name: "My Orders",
    icon: FaClipboardList,
    link: "/dashboard/orders",
  },
  
  {
  id: "quick-shop",
  name: "Quick Shop",
  icon: FaBoxOpen,
  link: "/dashboard/shop",
},
  {
    id: "deliveries",
    name: "Deliveries",
    icon: FaGift,
    link: "/dashboard/deliveries",
  },
  {
    id: "payments",
    name: "Payments",
    icon: FaMoneyBillWave,
    link: "/dashboard/payments",
  },
  {
    id: "cart",
    name: "Cart",
    icon: FaShoppingCart,
    link: "/dashboard/cart",
  },
  {
    id: "logout",
    name: "Logout",
    icon: FaSignOutAlt,
    action: "logout",
  },
];