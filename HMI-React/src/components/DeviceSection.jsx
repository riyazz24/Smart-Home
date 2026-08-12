import { useState } from "react";
import "./DeviceSection.css";

import DeviceCard from "./DeviceCard";
import CategoryTab from "./CategoryTab.jsx";

const categories = [
  "All",
  "Lighting",
  "Large Home Appliances",
  "Small Home Appliances",
  "Sockets",
];

const devices = [
  {
    id: 1,
    name: "esp 1.1",
    category: "Lighting",
    image: "/bulb.png",
  },
  {
    id: 2,
    name: "esp 2.1",
    category: "Lighting",
    image: "/lamp.png",
  },
  {
    id: 3,
    name: "esp 4.2",
    category: "Small Home Appliances",
    image: "/speaker.png",
  },
  {
    id: 4,
    name: "esp 2.3",
    category: "Sockets",
    image: "/socket.png",
  },
  {
    id: 5,
    name: "esp 2.2",
    category: "Lighting",
    image: "/fan.png",
  },
  {
    id: 6,
    name: "esp 4.1",
    category: "Large Home Appliances",
    image: "/fridge.png",
  },
  {
    id: 7,
    name: "esp 1.2",
    category: "Large Home Appliances",
    image: "/washing-machine.svg",
  },
];

function DeviceSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDevices =
    selectedCategory === "All"
      ? devices
      : devices.filter((device) => device.category === selectedCategory);

  return (
    <section className="device-section">
      <div className="category-tabs">
        {categories.map((category) => (
          <CategoryTab
            key={category}
            text={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      <div className="device-grid">
        {filteredDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </section>
  );
}

export default DeviceSection;
