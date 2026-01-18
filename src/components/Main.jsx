import React from "react";

function Main() {
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
          <button className="shopNow">Shop Now</button>
          <button className="learnMore">Learn More</button>
        </div>
      </div>

      <div className="main-right">
        <img src="/main-tea.png" alt="organic tea" />
      </div>
    </section>
  );
}

export default Main;
