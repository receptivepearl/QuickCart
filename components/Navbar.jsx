"use client"
import React from "react";
import { assets} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs" ;
import { CartIcon } from "@/assets/assets";
import { BagIcon } from "@/assets/assets";
import { HomeIcon } from "@/assets/assets";
import { BoxIcon } from "@/assets/assets";

const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const {openSignIn} = useClerk()

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/about" className="hover:text-gray-900 transition">About</Link>
        <Link href="/organizations/register" className="hover:text-gray-900 transition">Register Org</Link>
        <Link href="/org/dashboard" className="hover:text-gray-900 transition">Org Dashboard</Link>
        <Link href="/admin" className="hover:text-gray-900 transition">Admin</Link>
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        { 
          user 
          ? <>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label = "Cart" labelIcon = {<CartIcon />} onClick={()=> router.push('/cart')}/>
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label = "My Orders" labelIcon = {<BagIcon />} onClick={()=> router.push('/my-orders')}/>
            </UserButton.MenuItems>
          </UserButton>
          </>
          : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        }
      </ul>

      <div className="flex items-center md:hidden gap-3">
        { 
          user 
          ? <>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label = "Home" labelIcon = {<HomeIcon />} onClick={()=> router.push('/')}/>
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label = "About" labelIcon = {<BoxIcon />} onClick={()=> router.push('/about')}/>
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label = "Register Org" labelIcon = {<CartIcon />} onClick={()=> router.push('/organizations/register')}/>
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label = "Org Dashboard" labelIcon = {<BagIcon />} onClick={()=> router.push('/org/dashboard')}/>
            </UserButton.MenuItems>
          </UserButton>
          </>
          : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        }
      </div>
    </nav>
  );
};

export default Navbar;