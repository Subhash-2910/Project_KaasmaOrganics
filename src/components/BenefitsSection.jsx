import React from "react";
// import { FiLeaf, FiAward, FiTruck, FiHeart } from "react-icons/fi";

const benefits = [
  {
    title: "100% Organic",
    desc: "Certified organic ingredients with no harmful chemicals or pesticides",
    // icon: <FiLeaf />,
  },
  {
    title: "Premium Quality",
    desc: "Carefully selected and processed to retain maximum nutrients",
    // icon: <FiAward />,
  },
  {
    title: "Fast Delivery",
    desc: "Fresh products delivered quickly to your doorstep",
    // icon: <FiTruck />,
  },
  {
    title: "Health First",
    desc: "Dedicated to promoting your wellness through natural nutrition",
    // icon: <FiHeart />,
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
            {/* <div className="icon-circle">{item.icon}</div> */}
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection;
