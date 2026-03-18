const ALL_PRODUCTS = [
  {
    id: "p1",
    image: "assets/img/product/product1.jpg",
    title: "Ladies T-shirt",
    price: "RON 150.00",
    oldPrice: "RON 200.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["red", "blue", "white"],
    brand: "FashionHub",
  },

  {
    id: "p2",
    image: "assets/img/product/product2.jpg",
    title: "Mens T-shirt",
    price: "RON 130.00",
    oldPrice: "RON 180.00",
    rating: "4.5",
    reviewCount: "12",
    colors: ["black", "gray", "white"],
    brand: "StyleMax",
  },

  {
    id: "p3",
    image: "assets/img/product/product3.jpg",
    title: "Kids T-shirt",
    price: "RON 100.00",
    oldPrice: "RON 150.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["yellow", "green", "blue"],
    brand: "KidsWear",
  },

  {
    id: "p4",
    image: "assets/img/product/product4.jpg ",
    title: "Ladies set of T-shirt",
    price: "RON 450.00",
    oldPrice: "RON 600.00",
    rating: "5",
    reviewCount: "15",
    colors: ["pink", "purple", "white"],
    brand: "FashionHub",
  },

  {
    id: "p5",
    image: "assets/img/product/product5.jpg",
    title: "Unisex Nike Running Shoes",
    price: "RON 750.00",
    oldPrice: "RON 860.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["black", "white", "red"],
    brand: "Nike",
  },

  {
    id: "p6",
    image: "assets/img/product/product6.jpg",
    title: "Ladies sun glasses",
    price: "RON 550.00",
    oldPrice: "RON 700.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["black", "brown", "silver"],
    brand: "SunStyle",
  },

  {
    id: "p7",
    image: "assets/img/product/product7.jpg",
    title: "Ladies Wallet",
    price: "RON 550.00",
    oldPrice: "RON 700.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["black", "red", "brown"],
    brand: "LeatherLux",
  },

  {
    id: "p8",
    image: "assets/img/product/product8.jpg",
    title: "Casual Bags",
    price: "RON 250.00",
    oldPrice: "RON 300.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["blue", "gray", "black"],
    brand: "BagMaster",
  },

  {
    id: "p9",
    image: "assets/img/product/real-madrit-jersy.avif",
    title: "Casual Bags",
    price: "RON 230.00",
    oldPrice: "RON 290.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["white", "blue", "red"],
    brand: "SportWear",
  },

  {
    id: "p10",
    image: "assets/img/product/jens decathlons jacket.avif",
    title: "jens decathlons jacket",
    price: "RON 750.00",
    oldPrice: "RON 860.00",
    rating: "4.5",
    reviewCount: "10",
    colors: ["black", "navy", "gray"],
    brand: "Decathlon",
  },

  {
    id: "p10",
    image: "assets/img/product/ladies casual coat.webp",
    title: "Ladies Casual Coat",
    price: "RON 550.00",
    oldPrice: "RON 700.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/ladies-jackets.webp",
    title: "Ladies Jackets",
    price: "RON 350.00",
    oldPrice: "RON 400.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/jens-jeans.webp",
    title: "Jens Jeans",
    price: "RON 150.00",
    oldPrice: "RON 200.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/top-ware.webp",
    title: "Top Wear",
    price: "RON 250.00",
    oldPrice: "RON 300.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/mens t-shirts.webp",
    title: "Mens T-shirts",
    price: "RON 90.00",
    oldPrice: "RON 120.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/mens-hoodi.webp",
    title: "Mens Hoodie",
    price: "RON 250.00",
    oldPrice: "RON 300.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/mens-sweeter.jpg",
    title: "Mens Sweater",
    price: "RON 350.00",
    oldPrice: "RON 400.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/mens-leather-jacket.webp",
    title: "Mens Leather Jacket",
    price: "RON 950.00",
    oldPrice: "RON 1000.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/ladies-sweeter.jpg",
    title: "Ladies Sweater",
    price: "RON 350.00",
    oldPrice: "RON 400.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/mens-suede-shoe.webp",
    title: "Mens Suede Shoe",
    price: "RON 550.00",
    oldPrice: "RON 600.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/mens-shorts.webp",
    title: "Mens Shorts",
    price: "RON 250.00",
    oldPrice: "RON 300.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/mens-partyware-shoe.webp",
    title: "Mens Party Wear Shoe",
    price: "RON 650.00",
    oldPrice: "RON 700.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image:
      "assets/img/product/Cheyanne - Elegant cashmere sweater for women.webp",
    title: "Cheyanne - Elegant cashmere sweater for women",
    price: "RON 450.00",
    oldPrice: "RON 500.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/guess-skeaker.avif",
    title: "Guess Sneaker",
    price: "RON 450.00",
    oldPrice: "RON 500.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/addidas-bags.avif",
    title: "Addidas Bags",
    price: "RON 150.00",
    oldPrice: "RON 200.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/addidas-short.avif",
    title: "Addidas Shorts",
    price: "RON 250.00",
    oldPrice: "RON 300.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/hawkers-sunglasses.avif",
    title: "Hawkers Sunglasses",
    price: "RON 550.00",
    oldPrice: "RON 600.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/hugo-t-shirt.avif",
    title: "Hugo T-Shirt",
    price: "RON 250.00",
    oldPrice: "RON 300.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/allsaint.avif",
    title: "AllSaints Braslet",
    price: "RON 550.00",
    oldPrice: "RON 600.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/armani-watch.avif",
    title: "Armani Watch",
    price: "RON 1050.00",
    oldPrice: "RON 1200.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/dr-martens-boots.avif",
    title: "Dr. Martens Boots",
    price: "RON 950.00",
    oldPrice: "RON 1000.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/dr-martens-chelse.avif",
    title: "Dr. Martens Chelsea Boots",
    price: "RON 750.00",
    oldPrice: "RON 800.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/tomy-jeans-sneaker.avif",
    title: "Tomy Jeans Sneaker",
    price: "RON 550.00",
    oldPrice: "RON 600.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/tommy-hilfiger-cap.avif",
    title: "Tommy Hilfiger Cap",
    price: "RON 180.00",
    oldPrice: "RON 200.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/tommy-bag.avif",
    title: "Tommy Bag",
    price: "RON 780.00",
    oldPrice: "RON 800.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/timberland-boots.webp",
    title: "Timberland Boots",
    price: "RON 1000.00",
    oldPrice: "RON 1100.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/polo-sneaker.avif",
    title: "Polo Sneaker",
    price: "RON 750.00",
    oldPrice: "RON 800.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/northface-jacket.avif",
    title: "North Face Jacket",
    price: "RON 1750.00",
    oldPrice: "RON 1900.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/nike-sportware.avif",
    title: "Nike Sportware",
    price: "RON 850.00",
    oldPrice: "RON 900.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/nike-sneaker.avif",
    title: "Nike Sneaker",
    price: "RON 750.00",
    oldPrice: "RON 800.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/levi's-belt.avif",
    title: "Levi's Belt",
    price: "RON 250.00",
    oldPrice: "RON 300.00",
    rating: "4.5",
    reviewCount: "10",
  },

  {
    id: "p10",
    image: "assets/img/product/karl-lagerfeld-sneaker.avif",
    title: "Karl Lagerfeld Sneaker",
    price: "RON 750.00",
    oldPrice: "RON 800.00",
    rating: "4.5",
    reviewCount: "10",
  },
];

export default ALL_PRODUCTS;

console.log(ALL_PRODUCTS);
