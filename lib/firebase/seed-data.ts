import { Wrap, Ingredient, AddOn } from './firestore-schema';

// ============================================
// SEED DATA FOR WRAPS
// ============================================

export const seedWraps: Omit<Wrap, 'id' | 'createdAt'>[] = [
  {
    name: 'Classic Flour Tortilla',
    description: 'Traditional soft flour tortilla wrap',
    basePrice: 7.99,
    status: 'active',
  },
  {
    name: 'Whole Wheat Wrap',
    description: 'Healthy whole wheat tortilla',
    basePrice: 8.49,
    status: 'active',
  },
  {
    name: 'Spinach Herb Wrap',
    description: 'Green spinach tortilla with herbs',
    basePrice: 8.99,
    status: 'active',
  },
  {
    name: 'Lettuce Bowl',
    description: 'Fresh lettuce bowl (low-carb option)',
    basePrice: 7.49,
    status: 'active',
  },
  {
    name: 'Tomato Basil Wrap',
    description: 'Sun-dried tomato and basil tortilla',
    basePrice: 8.99,
    status: 'active',
  },
];

// ============================================
// SEED DATA FOR INGREDIENTS
// ============================================

export const seedIngredients: Omit<Ingredient, 'id'>[] = [
  // Proteins
  {
    name: 'Grilled Chicken',
    category: 'protein',
    priceAdd: 3.50,
    status: 'active',
    allergens: [],
  },
  {
    name: 'Spicy Beef',
    category: 'protein',
    priceAdd: 4.00,
    status: 'active',
    allergens: [],
  },
  {
    name: 'Falafel',
    category: 'protein',
    priceAdd: 3.00,
    status: 'active',
    allergens: ['gluten'],
  },
  {
    name: 'Grilled Shrimp',
    category: 'protein',
    priceAdd: 4.50,
    status: 'active',
    allergens: ['shellfish'],
  },
  {
    name: 'Black Beans',
    category: 'protein',
    priceAdd: 2.50,
    status: 'active',
    allergens: [],
  },
  
  // Veggies
  {
    name: 'Romaine Lettuce',
    category: 'veggie',
    priceAdd: 0.50,
    status: 'active',
  },
  {
    name: 'Tomatoes',
    category: 'veggie',
    priceAdd: 0.50,
    status: 'active',
  },
  {
    name: 'Red Onions',
    category: 'veggie',
    priceAdd: 0.50,
    status: 'active',
  },
  {
    name: 'Bell Peppers',
    category: 'veggie',
    priceAdd: 0.75,
    status: 'active',
  },
  {
    name: 'Cucumbers',
    category: 'veggie',
    priceAdd: 0.50,
    status: 'active',
  },
  {
    name: 'Avocado',
    category: 'veggie',
    priceAdd: 1.50,
    status: 'active',
  },
  {
    name: 'Pickles',
    category: 'veggie',
    priceAdd: 0.50,
    status: 'active',
  },
  
  // Cheese
  {
    name: 'Cheddar Cheese',
    category: 'cheese',
    priceAdd: 1.00,
    status: 'active',
    allergens: ['dairy'],
  },
  {
    name: 'Feta Cheese',
    category: 'cheese',
    priceAdd: 1.25,
    status: 'active',
    allergens: ['dairy'],
  },
  {
    name: 'Pepper Jack',
    category: 'cheese',
    priceAdd: 1.00,
    status: 'active',
    allergens: ['dairy'],
  },
];

// ============================================
// SEED DATA FOR ADD-ONS
// ============================================

export const seedAddOns: Omit<AddOn, 'id'>[] = [
  // Sauces
  {
    name: 'Garlic Aioli',
    type: 'sauce',
    price: 0.50,
    optional: true,
    status: 'active',
  },
  {
    name: 'Chipotle Mayo',
    type: 'sauce',
    price: 0.50,
    optional: true,
    status: 'active',
  },
  {
    name: 'Tzatziki',
    type: 'sauce',
    price: 0.75,
    optional: true,
    status: 'active',
  },
  {
    name: 'Hot Sauce',
    type: 'sauce',
    price: 0.00,
    optional: true,
    status: 'active',
  },
  {
    name: 'Ranch Dressing',
    type: 'sauce',
    price: 0.50,
    optional: true,
    status: 'active',
  },
  
  // Spices
  {
    name: 'Cajun Spice Mix',
    type: 'spice',
    price: 0.00,
    optional: true,
    status: 'active',
  },
  {
    name: 'Mediterranean Herbs',
    type: 'spice',
    price: 0.00,
    optional: true,
    status: 'active',
  },
  {
    name: 'Smoky BBQ Rub',
    type: 'spice',
    price: 0.00,
    optional: true,
    status: 'active',
  },
  
  // Extras
  {
    name: 'Extra Protein',
    type: 'extra',
    price: 3.00,
    optional: true,
    status: 'active',
  },
  {
    name: 'Crispy Onions',
    type: 'extra',
    price: 0.75,
    optional: true,
    status: 'active',
  },
  {
    name: 'Jalapeños',
    type: 'extra',
    price: 0.50,
    optional: true,
    status: 'active',
  },
];
