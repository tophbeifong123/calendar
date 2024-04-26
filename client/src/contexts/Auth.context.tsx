import conf from "@/conf/main";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "react-oidc-context";

// ประกาศ Context และ Provider
export const ProfileAuthContext = createContext<profileImg | null>(null);
interface profileImg {
  studentId: string;
  pictureBase64: string;
}
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const profileResult = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-image`,
        {
          headers: {
            token: auth.user?.access_token,
          },
        }
      );
      setProfile(profileResult.data[0]);
      console.log("ProfileData",profileResult.data[0]);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchProfile();
    }
  }, [auth]);

  return (
    <ProfileAuthContext.Provider value={profile}>
      {children}
    </ProfileAuthContext.Provider>
  );
};
