'use client';

import { useState, useEffect } from 'react';
import { Wrap, Ingredient, AddOn } from '../firebase/firestore-schema';
import { calculateTax } from '../utils/format';

interface SelectedIngredient {
  id: string;
  name: string;
  priceAdd: number;
  category: string;
}

interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
}

interface OrderBuilderState {
  selectedWrap: Wrap | null;
  selectedIngredients: SelectedIngredient[];
  selectedAddOns: SelectedAddOn[];
  basePrice: number;
  ingredientsTotal: number;
  addOnsTotal: number;
  subtotal: number;
  tax: number;
  total: number;
}

const MAX_INGREDIENTS = 10;
const MAX_PROTEINS = 2;

export function useOrderBuilder() {
  const [state, setState] = useState<OrderBuilderState>({
    selectedWrap: null,
    selectedIngredients: [],
    selectedAddOns: [],
    basePrice: 0,
    ingredientsTotal: 0,
    addOnsTotal: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // Calculate totals whenever selections change
  useEffect(() => {
    const basePrice = state.selectedWrap?.basePrice || 0;
    const ingredientsTotal = state.selectedIngredients.reduce(
      (sum, ing) => sum + ing.priceAdd,
      0
    );
    const addOnsTotal = state.selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    const subtotal = basePrice + ingredientsTotal + addOnsTotal;
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;

    setState((prev) => ({
      ...prev,
      basePrice,
      ingredientsTotal,
      addOnsTotal,
      subtotal,
      tax,
      total,
    }));
  }, [state.selectedWrap, state.selectedIngredients, state.selectedAddOns]);

  // Select wrap base
  const selectWrap = (wrap: Wrap) => {
    setState((prev) => ({ ...prev, selectedWrap: wrap }));
  };

  // Toggle ingredient selection
  const toggleIngredient = (ingredient: Ingredient): boolean => {
    const isSelected = state.selectedIngredients.some((i) => i.id === ingredient.id);

    if (isSelected) {
      // Remove ingredient
      setState((prev) => ({
        ...prev,
        selectedIngredients: prev.selectedIngredients.filter((i) => i.id !== ingredient.id),
      }));
      return true;
    } else {
      // Check limits
      if (state.selectedIngredients.length >= MAX_INGREDIENTS) {
        return false; // Max ingredients reached
      }

      // Check protein limit
      if (ingredient.category === 'protein') {
        const proteinCount = state.selectedIngredients.filter(
          (i) => i.category === 'protein'
        ).length;
        if (proteinCount >= MAX_PROTEINS) {
          return false; // Max proteins reached
        }
      }

      // Add ingredient
      setState((prev) => ({
        ...prev,
        selectedIngredients: [
          ...prev.selectedIngredients,
          {
            id: ingredient.id,
            name: ingredient.name,
            priceAdd: ingredient.priceAdd,
            category: ingredient.category,
          },
        ],
      }));
      return true;
    }
  };

  // Toggle add-on selection
  const toggleAddOn = (addOn: AddOn) => {
    const isSelected = state.selectedAddOns.some((a) => a.id === addOn.id);

    if (isSelected) {
      setState((prev) => ({
        ...prev,
        selectedAddOns: prev.selectedAddOns.filter((a) => a.id !== addOn.id),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        selectedAddOns: [
          ...prev.selectedAddOns,
          {
            id: addOn.id,
            name: addOn.name,
            price: addOn.price,
          },
        ],
      }));
    }
  };

  // Reset builder
  const reset = () => {
    setState({
      selectedWrap: null,
      selectedIngredients: [],
      selectedAddOns: [],
      basePrice: 0,
      ingredientsTotal: 0,
      addOnsTotal: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  };

  // Check if ingredient is selected
  const isIngredientSelected = (ingredientId: string) => {
    return state.selectedIngredients.some((i) => i.id === ingredientId);
  };

  // Check if add-on is selected
  const isAddOnSelected = (addOnId: string) => {
    return state.selectedAddOns.some((a) => a.id === addOnId);
  };

  // Get protein count
  const getProteinCount = () => {
    return state.selectedIngredients.filter((i) => i.category === 'protein').length;
  };

  // Validation
  const canAddToCart = () => {
    return state.selectedWrap !== null && state.selectedIngredients.length > 0;
  };

  return {
    ...state,
    selectWrap,
    toggleIngredient,
    toggleAddOn,
    reset,
    isIngredientSelected,
    isAddOnSelected,
    getProteinCount,
    canAddToCart,
    MAX_INGREDIENTS,
    MAX_PROTEINS,
  };
}
