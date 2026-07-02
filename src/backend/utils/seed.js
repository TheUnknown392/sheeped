db.countries.insertMany([
  {
    name: "Nepal",
    domestic_currency: "NPR",
    shipping: 150
  },
  {
    name: "India",
    domestic_currency: "INR",
    shipping: 500
  },
  {
    name: "China",
    domestic_currency: "YUAN",
    shipping: 3000
  }
]);

db.categories.insertMany([
  { category_name: "Electronics" },
  { category_name: "Clothing" },
  { category_name: "Books" },
  { category_name: "Home & Kitchen" },
  { category_name: "Beauty & Personal Care" },
  { category_name: "Sports & Outdoors" },
  { category_name: "Toys & Games" },
  { category_name: "Groceries" },
  { category_name: "Health & Wellness" },
  { category_name: "Automotive" }
]);


