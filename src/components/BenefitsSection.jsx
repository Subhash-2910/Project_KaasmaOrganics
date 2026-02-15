import React from "react";


const benefits = [
  {
    title: "100% Organic",
    desc: "Certified organic ingredients with no harmful chemicals or pesticides",

  },
  {
    title: "Premium Quality",
    desc: "Carefully selected and processed to retain maximum nutrients",
   
  },
  {
    title: "Fast Delivery",
    desc: "Fresh products delivered quickly to your doorstep",

  },
  {
    title: "Health First",
    desc: "Dedicated to promoting your wellness through natural nutrition",

  },
];

function BenefitsSection() {
  return (
    <section className="benefits">
      <h2>Why Choose Kasma Organics</h2>
      <p>
        We bring you the purest organic products, carefully crafted from
        nature's finest ingredients
      </p>

      <div className="benefits-grid">
        {benefits.map((item, index) => (
          <div className="benefit-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection;
