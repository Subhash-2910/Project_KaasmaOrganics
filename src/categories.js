// import { FiApple, FiCoffee } from "react-icons/fi";
// import { GiFruitBowl } from "react-icons/gi";
// import { TbSalad } from "react-icons/tb";
import fruitpowders from "./assets/images/fruitpowders.jpeg";
import fruitsnacks from "./assets/images/fruitsnacks.jpeg";
import vegiepowders from "./assets/images/vegiepowders.jpeg";
import vegiesnacks from "./assets/images/vegiesnacks.jpeg";

const categories = [
  {
    id: 1,
    title: "Fruit Powders",
    desc: "Nutrient-rich superfood powders",
    // icon: <TbSalad />,
    // icon: <FiApple />,
    image: fruitpowders,
  },
  {
    id: 2,
    title: "Vegetable Powders",
    desc: "Green superfood blends",
    // icon: <TbSalad />,
    image:vegiepowders,
  },
  {
    id: 3,
    title: "Fruit Snacks",
    desc: "Delicious dried fruit treats",
    // icon: <GiFruitBowl />,
    image: fruitsnacks,
  },
  {
    id: 4,
    title: "Vegetable Snacks",
    desc: "Healthy veggie chips & crisps",
    // icon: <FiCoffee />,
    image: vegiesnacks,
  },
];

export default categories;
