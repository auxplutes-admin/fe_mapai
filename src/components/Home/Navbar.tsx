import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SESSION_COOKIE_NAME } from "@/constant";

import UOTWAJ from "@/assets/UOTWAJ.png";


export const Navbar = () => {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
            description: "",
        },
    ];

    const [isOpen, setOpen] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = () => {
        return !!localStorage.getItem(SESSION_COOKIE_NAME);
    };

    const handleAuthNavigation = (path: string) => {
        if (isLoggedIn() && path === '/dashboard') {
            navigate('/dashboard');
        } else if (!isLoggedIn() && (path === '/signin' || path === '/login')) {
            navigate(path);
        }
    };

    return (
       <header className="w-full z-50 fixed top-0 left-0 bg-transparent">
            <div className="mx-auto h-30 flex items-center justify-between px-4 py-3">
                {/* Logo Section - Now aligned to the left */}
              <div className="flex flex-col items-center">
                 <div className="flex flex-col items-center">
                    <img
                        src={UOTWAJ}
                        alt="UOTWAJ Logo"
                        className="w-18 h-12 object-contain"
                    />
                </div>
                </div>
               
            </div>
        </header>
    );
};