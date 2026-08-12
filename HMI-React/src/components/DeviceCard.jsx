import { FaTrash, FaPen } from "react-icons/fa";

function DeviceCard({ device }) {
  return (
    <div className="device-card">
      <img src={device.image} alt={""} className="device-image" />

      <h3>{device.name}</h3>

      <div className="device-actions">
        <FaPen className="edit-icon" />

        <FaTrash className="delete-icon" />
      </div>
    </div>
  );
}

export default DeviceCard;
