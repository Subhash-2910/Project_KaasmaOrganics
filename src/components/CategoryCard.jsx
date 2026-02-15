import React from "react";

function CategoryCard(props) {
  return (
    <div
      className="category-card"
      style={{ backgroundImage: `url(${props.image})` }}
    >
      <div className="overlay">
        <div className="content">
          <h3>{props.title}</h3>
          <p>{props.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
