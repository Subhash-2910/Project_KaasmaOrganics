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
  const [selectedWeight, setSelectedWeight] = useState('100g');
  const [quantity, setQuantity] = useState(1);

  const weightOptions = [
    { value: '50g', price: props.price * 0.5 },
    { value: '100g', price: props.price },
    { value: '250g', price: props.price * 2.3 },
    { value: '500g', price: props.price * 4.5 }
  ];

  const handleAddToCart = () => {
    const product = {
      id: props.id || Math.random().toString(36).substr(2, 9),
      name: props.name,
      price: weightOptions.find(opt => opt.value === selectedWeight).price,
      image: props.image,
      category: props.category
    };
    addToCart(product, quantity, selectedWeight);
  };

  return (
    <div className="product-card">

      {/* IMAGE SECTION */}
      <div className="image-box">
        <span className="badge organic">100% Organic</span>
        {props.offer && (
          <span className="badge offer">{props.offer}</span>
        )}

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
              <img
                src={props.image}
                alt={`${props.name} front`}
              />
            </SwiperSlide>
          )}

          {props.backImage && (
            <SwiperSlide>
              <img
                src={props.backImage}
                alt={`${props.name} back`}
              />
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

        <div className="weight-selector">
          <label>Select Weight:</label>
          <div className="weight-options">
            {weightOptions.map((option) => (
              <button
                key={option.value}
                className={`weight-option ${
                  selectedWeight === option.value ? 'active' : ''
                }`}
                onClick={() => setSelectedWeight(option.value)}
                type="button"
              >
                {option.value}
                <span>₹{option.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quantity-selector">
          <button 
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            type="button"
            disabled={quantity <= 1}
          >
            <FiMinus size={14} />
          </button>
          <span>{quantity}</span>
          <button 
            onClick={() => setQuantity(prev => prev + 1)}
            type="button"
          >
            <FiPlus size={14} />
          </button>
        </div>

        <button 
          className="add-cart" 
          onClick={handleAddToCart}
        >
          Add to Cart - ₹{weightOptions.find(opt => opt.value === selectedWeight).price.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
