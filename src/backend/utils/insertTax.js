import mongoose from 'mongoose';
import dotenv from 'dotenv';

import './database.js'

import Country from '../models/CountryModel.js'
import Tax from '../models/TaxModel.js'
import Category from '../models/CategoryModel.js'

dotenv.config();

try {
  // Fetch countries and categories
  const countries = await Country.find().lean();
  const categories = await Category.find().lean();

  // Define tax multipliers
  const taxRates = {
    Nepal: {
      'Electronics': 1.13,
      'Clothing': 1.13,
      'Books': 1.00,
      'Home & Kitchen': 1.13,
      'Beauty & Personal Care': 1.13,
      'Sports & Outdoors': 1.13,
      'Toys & Games': 1.13,
      'Groceries': 1.00,
      'Health & Wellness': 1.13,
      'Automotive': 1.13
    },
    India: {
      'Electronics': 1.18,
      'Clothing': 1.05,
      'Books': 1.00,
      'Home & Kitchen': 1.18,
      'Beauty & Personal Care': 1.18,
      'Sports & Outdoors': 1.18,
      'Toys & Games': 1.18,
      'Groceries': 1.00,
      'Health & Wellness': 1.05,
      'Automotive': 1.28
    },
    China: {
      'Electronics': 1.13,
      'Clothing': 1.13,
      'Books': 1.09,
      'Home & Kitchen': 1.13,
      'Beauty & Personal Care': 1.13,
      'Sports & Outdoors': 1.13,
      'Toys & Games': 1.13,
      'Groceries': 1.09,
      'Health & Wellness': 1.13,
      'Automotive': 1.13
    }
  };

  // Build documents
  const docs = [];
  countries.forEach(country => {
    categories.forEach(category => {
      const rate = taxRates[country.name]?.[category.category_name] ?? 1.13;
      docs.push({
        country_id: country._id,
        category_id: category._id,
        Tax_per: rate
      });
    });
  });

  const result = await Tax.insertMany(docs);
  console.log(`✅ Inserted ${result.length} tax documents`);
  console.log('Sample:', result[0]);

} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await mongoose.disconnect();
}
