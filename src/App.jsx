import React from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import CategorySection from "./components/CategorySection";
import Footer from "./components/Footer";
import BenefitsSection from "./components/BenefitsSection";
import FeaturedProducts from "./components/FeaturedProducts";

function App() {
  return (
    <div>
      <Navbar />
      <Main />
      <CategorySection />
      <FeaturedProducts />
      <BenefitsSection />
      <Footer />
    </div>
  );
}

export default App;
