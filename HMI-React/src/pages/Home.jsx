import DeviceSection from "../components/DeviceSection";
import TopBar from "../components/TopBar";
import BottomNavigation from "../components/BottomNavigation";
import profilepic from "../images/profile-pic.jpeg";

export const Home = () => {
  return (
    <div>
      <TopBar userName={"Jagath"} profileImage={profilepic} />

      <DeviceSection />
      <BottomNavigation />
    </div>
  );
};
