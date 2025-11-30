import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Clock, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20 md:py-32">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Fresh, Custom{' '}
                <span className="text-primary">Wraps & Rolls</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Build your perfect meal with our wide selection of bases, proteins, veggies, and sauces. 
                Made fresh to order, just the way you like it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/order">
                  <Button size="lg" className="w-full sm:w-auto">
                    Order Now
                  </Button>
                </Link>
                <Link href="/reservations">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Make a Reservation
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://res.cloudinary.com/djljkfhjx/image/upload/v1764511189/my%20portfolio/61509_dpenfm.jpg"
                alt="Fresh healthy wraps and vegetables"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Urban Wraps?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the freshest, most customizable wraps in town.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fully Customizable</CardTitle>
                <CardDescription>
                  Choose from 5 wrap types, 15+ ingredients, and 11 sauces & spices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Fast & Fresh</CardTitle>
                <CardDescription>
                  Made to order in minutes with the freshest ingredients
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Quality Guaranteed</CardTitle>
                <CardDescription>
                  Premium ingredients and exceptional taste in every bite
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Perfect Wrap?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Start customizing your order now and taste the difference!
          </p>
          <Link href="/order">
            <Button size="lg" variant="secondary">
              Start Your Order
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Urban Wraps</h3>
              <p className="text-sm text-muted-foreground">
                Fresh, customizable wraps and rolls made just for you.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 10am - 9pm<br />
                Saturday - Sunday: 11am - 10pm
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: hello@urbanwraps.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Urban Wraps. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
