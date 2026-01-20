import React from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Footer from "./Footer";
import CategorySection from "./CategorySection";
import Benefits from "./Benifits";
import FeaturedProducts from "./FeaturedProducts";

function App() {
  return (
    <div>
      <Navbar />
      <Main />
      <CategorySection />
      <FeaturedProducts />
      <Benefits />
      <Footer />
    </div>
  );
}

export default App;
