import React from "react";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import CategorySection from "../components/CategorySection";
import Footer from "../components/Footer";
import BenefitsSection from "../components/BenefitsSection";
import FeaturedProducts from "../components/FeaturedProducts";

function Home() {
  return (
    <div>
      <div id="home">
        <Navbar />
        <Main />
      </div>
      <div id="shop">
        <CategorySection />
      </div>
      <FeaturedProducts />
      <div id="about">
        <BenefitsSection />
      </div>
      
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
