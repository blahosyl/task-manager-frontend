import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

/** Export the profile data in a context
 * so it can be used throughout the app */
export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // used in ProfileDetail.js
    pageProfile: { results: [] },
    // used in ProfileList.js
    profileList: { results: [] },
  });

  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/profiles/?ordering=-updated_at");
        setProfileData((prevState) => ({
          ...prevState,
          profileList: data,
        }));
      } catch (err) {
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={setProfileData}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
