'use client';

import React from 'react';
import { Ingredient } from '@/lib/firebase/firestore-schema';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';

interface IngredientSelectorProps {
  ingredients: Ingredient[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: Ingredient) => boolean;
  maxIngredients: number;
  maxProteins: number;
  proteinCount: number;
}

export function IngredientSelector({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients,
  maxProteins,
  proteinCount,
}: IngredientSelectorProps) {
  // Group ingredients by category
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const categoryLabels: Record<string, string> = {
    protein: 'Proteins',
    veggie: 'Vegetables',
    cheese: 'Cheese',
    other: 'Other',
  };

  const handleToggle = (ingredient: Ingredient) => {
    const success = onToggleIngredient(ingredient);
    if (!success) {
      if (ingredient.category === 'protein' && proteinCount >= maxProteins) {
        toast.error(`Maximum ${maxProteins} proteins allowed`);
      } else if (selectedIngredients.length >= maxIngredients) {
        toast.error(`Maximum ${maxIngredients} ingredients allowed`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">2. Choose Your Fillings</h2>
        <p className="text-muted-foreground">
          Select up to {maxIngredients} ingredients (max {maxProteins} proteins)
        </p>
        <div className="mt-2">
          <Badge variant="secondary">
            {selectedIngredients.length} / {maxIngredients} selected
          </Badge>
          {proteinCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {proteinCount} / {maxProteins} proteins
            </Badge>
          )}
        </div>
      </div>

      {Object.entries(groupedIngredients).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold">{categoryLabels[category] || category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient.id);
              const isDisabled =
                !isSelected &&
                (selectedIngredients.length >= maxIngredients ||
                  (ingredient.category === 'protein' && proteinCount >= maxProteins));

              return (
                <Card
                  key={ingredient.id}
                  className={`transition-all ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  } ${isDisabled ? 'opacity-50' : 'hover:shadow-md cursor-pointer'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={ingredient.id}
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(ingredient)}
                        disabled={isDisabled}
                      />
                      <Label
                        htmlFor={ingredient.id}
                        className={`flex-1 ${isDisabled ? '' : 'cursor-pointer'}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{ingredient.name}</span>
                            {ingredient.priceAdd > 0 && (
                              <span className="text-sm font-semibold text-primary">
                                +{formatCurrency(ingredient.priceAdd)}
                              </span>
                            )}
                          </div>
                          {ingredient.allergens && ingredient.allergens.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Contains: {ingredient.allergens.join(', ')}
                            </p>
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
