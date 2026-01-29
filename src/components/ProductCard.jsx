import React, { useState } from "react";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useCart } from "../context/CartContext.jsx";
import { FiPlus, FiMinus } from "react-icons/fi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function ProductCard(props) {
  const swiperRef = useRef(null);
  const { addToCart } = useCart();

  // Handle weight options from backend (weightOptions array) or static data (price)
  const getWeightOptions = () => {
    if (
      props.weightOptions &&
      Array.isArray(props.weightOptions) &&
      props.weightOptions.length > 0
    ) {
      // Use weightOptions from backend
      return props.weightOptions.map((opt) => ({
        value: opt.weight,
        price: opt.price,
      }));
    } else if (props.price && !isNaN(parseFloat(props.price))) {
      // Fallback to calculated prices from single price
      const basePrice = parseFloat(props.price);
      return [
        { value: "50g", price: basePrice * 0.5 },
        { value: "100g", price: basePrice },
        { value: "250g", price: basePrice * 2.3 },
        { value: "500g", price: basePrice * 4.5 },
      ];
    } else {
      // Default fallback
      return [{ value: "100g", price: 0 }];
    }
  };

  const weightOptions = getWeightOptions();
  const defaultWeight = weightOptions[0]?.value || "100g";
  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const selectedOption = weightOptions.find(
      (opt) => opt.value === selectedWeight,
    );
    if (
      !selectedOption ||
      !selectedOption.price ||
      isNaN(selectedOption.price)
    ) {
      console.error("Invalid weight or price selected");
      return;
    }

    const product = {
      id: props.id || props._id || Math.random().toString(36).substr(2, 9),
      _id: props._id || props.id,
      name: props.name,
      price: parseFloat(selectedOption.price),
      image: props.image,
      category: props.category,
      weight: selectedWeight,
      quantity: parseInt(quantity) || 1,
    };
    addToCart(product);
  };

  return (
    <div className="product-card">
      {/* IMAGE SECTION */}
      <div className="image-box">
        
        {props.offer && <span className="badge offer">{props.offer}</span>}

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Pagination, Navigation]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          autoHeight={true}
        >
          {props.image && (
            <SwiperSlide>
              <img src={props.image} alt={`${props.name} front`} />
            </SwiperSlide>
          )}

          {props.backImage && (
            <SwiperSlide>
              <img src={props.backImage} alt={`${props.name} back`} />
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="product-body">
        <span className="category">{props.category}</span>
        <h3>{props.name}</h3>
        <p className="desc">{props.desc}</p>

        <div className="rating">
          {"★".repeat(props.rating || 5)}
          {"☆".repeat(5 - (props.rating || 5))}
          <span>({props.reviews || 0})</span>
        </div>

        {/* WEIGHT SELECTOR – DROPDOWN INSTEAD OF PILLS */}
        <div className="quantity-selector">
          <label>Select Weight:</label>

          <select
            className="weight-dropdown"
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
          >
            {weightOptions.map((option) => {
              const price = parseFloat(option.price) || 0;
              return (
                <option key={option.value} value={option.value}>
                  {option.value} – ₹{price.toFixed(2)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="quantity-selector">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            type="button"
            disabled={quantity <= 1}
          >
            <FiMinus size={14} />
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((prev) => prev + 1)} type="button">
            <FiPlus size={14} />
          </button>
        </div>

        <button className="add-cart" onClick={handleAddToCart}>
          Add to Cart - ₹
          {(
            weightOptions.find((opt) => opt.value === selectedWeight)?.price ||
            0
          ).toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
