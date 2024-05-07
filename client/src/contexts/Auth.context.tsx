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
export const ProfileAuthContext = createContext<{
  profile: profileImg | null;
  user: User | null;
  triggerFetch? : () => void;
}>({ profile: null, user: null });
interface profileImg {
  studentId: string;
  pictureBase64: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
}

interface User {
  id: number;
  events?: Event[];
}

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  const [profile, setProfile] = useState<profileImg | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fetchData, setFetchData] = useState<boolean>(true);

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
      // console.log("ProfileData",profileResult.data[0]);
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchUser = async () => {
    try {
      if (!auth.user) return;
      const userResult = await axios.get(
        `${conf.apiUrlPrefix}/user?studentId=${auth.user?.profile.nickname}`
      );
      setUser(userResult.data[0]);
      // console.log("user", userResult.data[0]);
    } catch (error) {
      console.error("error", error);
    }
  };

  const triggerFetch  = () => {
    setFetchData(!fetchData);
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchProfile();
      fetchUser();
    }
  }, [auth, fetchData]);

  return (
    <ProfileAuthContext.Provider value={{ profile, user, triggerFetch  }}>
      {children}
    </ProfileAuthContext.Provider>
  );
};
