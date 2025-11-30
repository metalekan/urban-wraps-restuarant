'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ShoppingCart, User, LogOut, Settings, ShoppingBag, Calendar } from 'lucide-react';

export function Header() {
  const { user, userProfile, logout } = useAuth();
  const { itemCount } = useCart();

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-24 w-24">
            <Image
              src="https://res.cloudinary.com/djljkfhjx/image/upload/v1764511971/my%20portfolio/urban-wrap-logo_xswrb7.png"
              alt="Urban Wraps"
              fill
              className="object-contain mix-blend-multiply dark:mix-blend-screen object-cover h-full w-full"
              priority
            />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/order" className="text-sm font-medium transition-colors hover:text-primary">
            Order Now
          </Link>
          <Link href="/reservations" className="text-sm font-medium transition-colors hover:text-primary">
            Reservations
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              My Account
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt={userProfile?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(userProfile?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/orders" className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/reservations" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Reservations</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
