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
        `https://api-gateway.psu.ac.th/Test/regist/level2/StudentImage/token`,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user?.access_token,
          },
        }
      );
      setProfile(profileResult.data.data[0]);
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
