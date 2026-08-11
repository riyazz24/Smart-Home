function CategoryTab({ text, active, onClick }) {
  return (
    <button
      className={active ? "category-tab active" : "category-tab"}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default CategoryTab;
