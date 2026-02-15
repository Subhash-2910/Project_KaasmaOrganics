import React from "react";
import CategoryCard from "./CategoryCard";
import categories from "../categories";

function createCard(category) {
  return (
    <CategoryCard
      key={category.id}
      image={category.image}
      title={category.title}
      desc={category.desc}
    />
  );
}

function CategorySection() {
  return (
    <section className="category-section">
      <h2 style={{ fontSize: "32px", color: "#0f172a" }}>Shop By Category</h2>
      <p style={{ marginTop: "10px", color: "#6b7280", marginBottom: "50px" }}>
        Explore our range of premium organic products
      </p>
      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {categories.map(createCard)}
      </div>
    </section>
  );
}

export default CategorySection;
