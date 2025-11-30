'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, Calendar, Settings, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/dashboard',
      label: 'Overview',
      icon: User,
    },
    {
      href: '/dashboard/orders',
      label: 'My Orders',
      icon: ShoppingBag,
    },
    {
      href: '/dashboard/reservations',
      label: 'Reservations',
      icon: Calendar,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Welcome, {userProfile?.name || 'User'}
          </p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
