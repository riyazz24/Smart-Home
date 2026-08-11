import "./OnboardingCard.css";

function OnboardingCard({
  image,
  title,
  description,
  currentPage,
  totalPages,
  nextPage,
}) {
  return (
    <div className="onboarding-card">
      <img src={image} alt="" className="onboarding-image" />

      <div className="dots">
        {[...Array(totalPages)].map((_, index) => (
          <span
            key={index}
            className={currentPage === index ? "dot active" : "dot"}
          />
        ))}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <button className="primary-btn" onClick={nextPage}>
        Next
      </button>
    </div>
  );
}

export default OnboardingCard;
