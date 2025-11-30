'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Clock, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ReservationsPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate available time slots (11 AM - 9 PM)
  const timeSlots = [
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM',
    '9:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        toast.error('You must be logged in to make a reservation');
        router.push('/auth');
        return;
      }

      if (!selectedDate) {
        toast.error('Please select a date');
        setIsLoading(false);
        return;
      }

      if (!selectedTime) {
        toast.error('Please select a time');
        setIsLoading(false);
        return;
      }

      // Create reservation in Firestore
      const reservationData = {
        userId: user.uid,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        partySize,
        status: 'pending',
        notes: notes || null,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'reservations'), reservationData);

      toast.success('Reservation request submitted!');
      router.push('/dashboard/reservations');
    } catch (error: any) {
      console.error('Reservation error:', error);
      toast.error(error.message || 'Failed to create reservation');
    } finally {
      setIsLoading(false);
    }
  };

  // Disable past dates
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Make a Reservation</h1>
          <p className="text-muted-foreground">
            Reserve a table at Urban Wraps for your next visit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Date & Time */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
                <CardDescription>Choose your preferred date</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disabledDates}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Select Time
                </CardTitle>
                <CardDescription>Choose your preferred time slot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Party Size */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Party Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    disabled={partySize <= 1}
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold w-12 text-center">{partySize}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPartySize(Math.min(20, partySize + 1))}
                    disabled={partySize >= 20}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    {partySize === 1 ? 'guest' : 'guests'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                    placeholder="Any dietary restrictions or special requests?"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Reservation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Not selected'}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedTime || 'Not selected'}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Party Size</p>
                    <p className="font-medium">
                      {partySize} {partySize === 1 ? 'guest' : 'guests'}
                    </p>
                  </div>
                </div>

                <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Confirm Reservation'
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  You'll receive a confirmation email shortly
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
