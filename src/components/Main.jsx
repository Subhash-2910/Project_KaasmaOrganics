import React from "react";
import mainimage from "../assets1/images/kasma.jpeg";

function Main() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="main">
      <div className="main-left">
        <span className="badge">🌿 100% Certified Organic</span>

        <h1>
          Nature's Goodness <br />
          <span>In Every Bite</span>
        </h1>

        <p>
          Premium organic fruit and vegetable powders and snacks. Pure, natural,
          and packed with nutrients for your healthy lifestyle.
        </p>

        <div className="main-buttons">
          <button className="shopNow" onClick={(e) => handleScroll(e, 'shop')}>Shop Now</button>
          <button className="learnMore" onClick={(e) => handleScroll(e, 'about')}>Learn More</button>
        </div>
      </div>

      <div className="main-right">
        <img src={mainimage} alt="organic tea" />
      </div>
    </section>
  );
}

export default Main;
