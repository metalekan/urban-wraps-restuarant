'use client';

import React from 'react';
import { Wrap } from '@/lib/firebase/firestore-schema';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils/format';
import { Check } from 'lucide-react';

interface BaseSelectorProps {
  wraps: Wrap[];
  selectedWrap: Wrap | null;
  onSelectWrap: (wrap: Wrap) => void;
}

export function BaseSelector({ wraps, selectedWrap, onSelectWrap }: BaseSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">1. Choose Your Base</h2>
        <p className="text-muted-foreground">Select your wrap or bowl</p>
      </div>

      <RadioGroup
        value={selectedWrap?.id || ''}
        onValueChange={(value) => {
          const wrap = wraps.find((w) => w.id === value);
          if (wrap) onSelectWrap(wrap);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wraps.map((wrap) => (
            <div key={wrap.id} className="relative">
              <RadioGroupItem
                value={wrap.id}
                id={wrap.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={wrap.id}
                className="flex flex-col cursor-pointer"
              >
                <Card className="relative overflow-hidden transition-all hover:shadow-lg peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary">
                  {selectedWrap?.id === wrap.id && (
                    <div className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{wrap.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {wrap.description}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(wrap.basePrice)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
