const dummyProducts = [
  {
    id: 1,
    name: "Fresh Apple",
    price: 100,
    offerPrice: getDiscountedPrice(100),
    category: "Fruits",
    image: "apple.jpg"
  },
  {
    id: 2,
    name: "Banana",
    price: 60,
    offerPrice: getDiscountedPrice(60),
    category: "Fruits",
    image: "banana.jpg"
  },
  {
    id: 3,
    name: "Orange",
    price: 80,
    offerPrice: getDiscountedPrice(80),
    category: "Fruits",
    image: "orange.jpg"
  },
  {
    id: 4,
    name: "Tomato",
    price: 40,
    offerPrice: getDiscountedPrice(40),
    category: "Vegetables",
    image: "tomato.jpg"
  },
  {
    id: 5,
    name: "Milk 1L",
    price: 50,
    offerPrice: getDiscountedPrice(50),
    category: "Dairy",
    image: "milk.jpg"
  },
  {
    id: 6,
    name: "Broccoli",
    price: 90,
    offerPrice: getDiscountedPrice(90),
    category: "Vegetables",
    image: "broccoli.jpg"
  },
  {
    id: 7,
    name: "Cheese Block",
    price: 150,
    offerPrice: getDiscountedPrice(150),
    category: "Dairy",
    image: "cheese.jpg"
  },
  {
    id: 8,
    name: "Bread",
    price: 35,
    offerPrice: getDiscountedPrice(35),
    category: "Bakery",
    image: "bread.jpg"
  },
  {
    id: 9,
    name: "Eggs (12 pcs)",
    price: 70,
    offerPrice: getDiscountedPrice(70),
    category: "Poultry",
    image: "eggs.jpg"
  },
  {
    id: 10,
    name: "Chicken Breast",
    price: 200,
    offerPrice: getDiscountedPrice(200),
    category: "Poultry",
    image: "chicken.jpg"
  }
];

// Helper function for 5–10% random discount
function getDiscountedPrice(price) {
  const discount = Math.floor(Math.random() * 6) + 5; // 5 to 10%
  return Math.floor(price - (price * discount) / 100);
}

export default dummyProducts;
