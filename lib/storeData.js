// Ecommerce Store Product Catalog & Helpers

export const products = [
  {
    id: 'prod_001',
    name: 'Classic Leather Jacket',
    brand: 'NOIR Collection',
    price: 189.99,
    image: '/products/leather-jacket.png',
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    description: 'Premium genuine leather jacket with modern slim fit. Perfect for all seasons.',
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 'prod_002',
    name: 'Essential Cotton Tee',
    brand: 'NOIR Basics',
    price: 29.99,
    image: '/products/white-tshirt.png',
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Gray'],
    description: 'Ultra-soft 100% organic cotton t-shirt. Everyday essential with premium feel.',
    rating: 4.6,
    reviews: 342,
  },
  {
    id: 'prod_003',
    name: 'Slim Fit Denim',
    brand: 'NOIR Denim',
    price: 79.99,
    image: '/products/denim-jeans.png',
    category: 'Jeans',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Dark Blue', 'Black', 'Light Wash'],
    description: 'Modern slim fit jeans with stretch comfort. Crafted from premium Japanese denim.',
    rating: 4.7,
    reviews: 256,
  },
  {
    id: 'prod_004',
    name: 'Urban Comfort Hoodie',
    brand: 'NOIR Street',
    price: 59.99,
    image: '/products/casual-hoodie.png',
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Gray', 'Black'],
    description: 'Heavyweight fleece hoodie with kangaroo pocket. Cozy meets street style.',
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 'prod_005',
    name: 'Floral Summer Dress',
    brand: 'NOIR Femme',
    price: 69.99,
    image: '/products/floral-dress.png',
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Print', 'Blue'],
    description: 'Elegant floral print dress perfect for summer outings. Light and breathable fabric.',
    rating: 4.5,
    reviews: 167,
  },
  {
    id: 'prod_006',
    name: 'Cloud Runner Sneakers',
    brand: 'NOIR Active',
    price: 129.99,
    image: '/products/sneakers.png',
    category: 'Shoes',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black/White'],
    description: 'Ultra-lightweight running sneakers with cloud cushioning technology.',
    rating: 4.8,
    reviews: 203,
  },
];

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
