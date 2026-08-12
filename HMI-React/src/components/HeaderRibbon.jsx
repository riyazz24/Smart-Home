import { FaUser } from "react-icons/fa";

function HeaderRibbon({ title }) {
  return (
    <div className="header-ribbon">
      <FaUser />
      <span>{title}</span>
    </div>
  );
}

export default HeaderRibbon;
