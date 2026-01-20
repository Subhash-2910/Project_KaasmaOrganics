import React from "react";
// import { FiShoppingCart } from "react-icons/fi";
import featuredProducts from "../featuredProducts";
import ProductCard from "./ProductCard";

function createCard(fProduct, index) {
  return (
    <ProductCard
      // also works  key={featuredProducts.indexOf(fProduct)}
      key={index}
      name={fProduct.name}
      category={fProduct.category}
      desc={fProduct.desc}
      price={fProduct.price}
      oldPrice={fProduct.oldPrice}
      rating={fProduct.rating}
      reviews={fProduct.reviews}
      image={fProduct.image}
      offer={fProduct.offer}
    />
  );
}

function FeaturedProducts() {
  return (
    <section className="featured">
      <div className="featured-header">
        <div>
          <h2>Featured Products</h2>
          <p>Our most popular organic items</p>
        </div>
        <button className="view-all">View All Products</button>
      </div>

      <div className="product-grid">{featuredProducts.map(createCard)}</div>
    </section>
  );
}

export default FeaturedProducts;
