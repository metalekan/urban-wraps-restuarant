'use client';

import React from 'react';
import { AddOn } from '@/lib/firebase/firestore-schema';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils/format';

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: string[];
  onToggleAddOn: (addOn: AddOn) => void;
}

export function AddOnSelector({
  addOns,
  selectedAddOns,
  onToggleAddOn,
}: AddOnSelectorProps) {
  // Group add-ons by type
  const groupedAddOns = addOns.reduce((acc, addOn) => {
    if (!acc[addOn.type]) {
      acc[addOn.type] = [];
    }
    acc[addOn.type].push(addOn);
    return acc;
  }, {} as Record<string, AddOn[]>);

  const typeLabels: Record<string, string> = {
    sauce: 'Sauces',
    spice: 'Spices & Seasonings',
    extra: 'Extras',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">3. Add Sauces & Extras</h2>
        <p className="text-muted-foreground">Customize your wrap with sauces and extras</p>
      </div>

      {Object.entries(groupedAddOns).map(([type, items]) => (
        <div key={type} className="space-y-3">
          <h3 className="text-lg font-semibold">{typeLabels[type] || type}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((addOn) => {
              const isSelected = selectedAddOns.includes(addOn.id);

              return (
                <Card
                  key={addOn.id}
                  className={`transition-all hover:shadow-md cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={addOn.id}
                        checked={isSelected}
                        onCheckedChange={() => onToggleAddOn(addOn)}
                      />
                      <Label htmlFor={addOn.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{addOn.name}</span>
                          {addOn.price > 0 ? (
                            <span className="text-sm font-semibold text-primary">
                              +{formatCurrency(addOn.price)}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Free</span>
                          )}
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
