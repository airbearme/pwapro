"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/components/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Star,
  Heart,
  Shirt,
  Coffee,
  Crown,
  Package,
  MapPin,
  Clock,
  Truck,
  ShoppingBag,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface MerchandiseItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  icon: React.ReactNode;
  inStock: boolean;
}

export default function MerchandisePage() {
  const { user, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const merchandiseItems: MerchandiseItem[] = [
    {
      id: "ceo-tshirt",
      name: "CEO T-Shirt",
      price: 29.99,
      description: "Premium quality AirBear CEO t-shirt with embroidered logo",
      category: "Apparel",
      icon: <Shirt className="w-6 h-6" />,
      inStock: true,
    },
    {
      id: "airbear-mug",
      name: "AirBear Coffee Mug",
      price: 14.99,
      description: "Ceramic mug with AirBear mascot design",
      category: "Drinkware",
      icon: <Coffee className="w-6 h-6" />,
      inStock: true,
    },
    {
      id: "airbear-hat",
      name: "AirBear Cap",
      price: 19.99,
      description: "Adjustable baseball cap with AirBear logo",
      category: "Apparel",
      icon: <Crown className="w-6 h-6" />,
      inStock: true,
    },
    {
      id: "eco-tote",
      name: "Eco-Friendly Tote Bag",
      price: 12.99,
      description: "Reusable shopping bag made from recycled materials",
      category: "Accessories",
      icon: <Package className="w-6 h-6" />,
      inStock: true,
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <p className="text-xl text-muted-foreground animate-pulse">
            Loading merchandise...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            🛍️ AirBear Merchandise Shop
          </h1>
          <p className="text-lg text-muted-foreground">
            Get your exclusive AirBear gear and show your eco-friendly pride!
          </p>
        </div>

        {/* Store Location Info */}
        <Card className="mb-8 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Store Location
            </CardTitle>
            <CardDescription>
              Visit our flagship store for the full merchandise experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-semibold">Downtown Location</p>
                  <p className="text-sm text-muted-foreground">
                    42.098700, -75.917000
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-sm text-muted-foreground">
                    9 AM - 8 PM Daily
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Truck className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold">Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Free delivery over $50
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Merchandise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {merchandiseItems.map((item) => (
            <Card key={item.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      ${item.price}
                    </p>
                    {item.inStock ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    disabled={!item.inStock}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" aria-label="Add to favorites">
                        <Star className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to favorites</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Offers */}
        <Card className="mb-8 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600" />
              Special Offers
            </CardTitle>
            <CardDescription>
              Limited time deals for AirBear riders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 rounded-lg border-2 border-emerald-500/20">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  🎉 Rider Discount
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Get 15% off any merchandise when you show your recent ride
                  receipt!
                </p>
                <Button variant="outline" size="sm">
                  Claim Discount
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border-2 border-amber-500/20">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  🌟 Eco Warrior Bundle
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  T-Shirt + Tote Bag + Mug for just $49.99 (Save $8!)
                </p>
                <Button variant="outline" size="sm">
                  Get Bundle
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Booking */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/book">🚗 Back to Ride Booking</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
