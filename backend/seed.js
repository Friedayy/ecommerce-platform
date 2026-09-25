const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const demoProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound.',
    price: 199.99,
    category: 'Electronics',
    stock: 25,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches, aluminum frame, and programmable keys.',
    price: 129.99,
    category: 'Electronics',
    stock: 18,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'High-back mesh office chair with adjustable lumbar support, 3D armrests, and breathable material.',
    price: 249.99,
    category: 'Home',
    stock: 12,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Stainless Steel Water Bottle (32oz)',
    description: 'Vacuum-insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 29.99,
    category: 'Sports',
    stock: 50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Classic Leather Backpack',
    description: 'Handcrafted genuine leather backpack with padded 15-inch laptop compartment and vintage brass hardware.',
    price: 89.99,
    category: 'Clothing',
    stock: 15,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Smart Fitness Tracker Watch',
    description: 'Waterproof smartwatch with heart rate monitoring, sleep tracking, GPS, and 7-day battery.',
    price: 79.99,
    category: 'Electronics',
    stock: 30,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // 1. Ensure customer@example.com exists with password123
    let customer = await User.findOne({ email: 'customer@example.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Demo Customer',
        email: 'customer@example.com',
        password: 'password123',
        role: 'user'
      });
      console.log('Created demo customer: customer@example.com (password: password123)');
    } else {
      customer.password = 'password123';
      customer.role = 'user';
      await customer.save();
      console.log('Updated demo customer: customer@example.com (password: password123)');
    }

    // 2. Ensure admin@example.com exists with password123 and role admin
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Demo Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Created demo admin: admin@example.com (password: password123)');
    } else {
      adminUser.password = 'password123';
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Updated demo admin: admin@example.com (password: password123)');
    }

    // 3. Ensure products exist and have image URLs
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(demoProducts);
      console.log(`Seeded ${demoProducts.length} demo products successfully!`);
    } else {
      for (const prod of demoProducts) {
        await Product.findOneAndUpdate(
          { name: prod.name },
          { image: prod.image },
          { new: true }
        );
      }
      console.log(`Updated images for existing ${count} products.`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
