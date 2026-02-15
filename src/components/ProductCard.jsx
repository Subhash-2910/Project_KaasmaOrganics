import React, { useContext } from "react";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { CartContext } from "../features/ContextProvider";

function ProductCard(props) {
  const { dispatch } = useContext(CartContext);
  const swiperRef = useRef(null);

  return (
    <div className="product-card">
      {/* IMAGE SECTION */}
      <div className="image-box">
        <span className="badge organic">100% Organic</span>
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
          {"★".repeat(props.rating)}
          {"☆".repeat(5 - props.rating)}
          <span>({props.reviews})</span>
        </div>

        <div className="price">
          <span className="current">${props.price}</span>
          {props.oldPrice && <span className="old">${props.oldPrice}</span>}
        </div>
        <button
          className="add-cart"
          onClick={() => {
            dispatch({ type: "Add", product: props });
          }}
        >
          {/* <FiShoppingCart /> */}
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
