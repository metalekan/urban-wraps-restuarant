'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { useOrders } from '@/lib/contexts/OrderContext';

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const { orders } = useOrders();

  const stats = [
    {
      title: 'Total Orders',
      value: orders?.length || 0,
      icon: ShoppingBag,
      href: '/dashboard/orders',
      color: 'text-primary',
    },
    {
      title: 'Reservations',
      value: userProfile?.reservationHistory?.length || 0,
      icon: Calendar,
      href: '/dashboard/reservations',
      color: 'text-secondary',
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {userProfile?.name}!</h1>
        <p className="text-lg text-muted-foreground">
          Manage your orders, reservations, and profile
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <Link href={stat.href}>
                  <Button variant="link" className="px-0 mt-2">
                    View all →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>What would you like to do today?</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <Link href="/order">
            <Button className="w-full" size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order Now
            </Button>
          </Link>
          <Link href="/reservations">
            <Button variant="secondary" className="w-full" size="lg">
              <Calendar className="mr-2 h-5 w-5" />
              Make Reservation
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full" size="lg">
              <User className="mr-2 h-5 w-5" />
              Edit Profile
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{userProfile?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{userProfile?.phone || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium">
              {userProfile?.createdAt
                ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
