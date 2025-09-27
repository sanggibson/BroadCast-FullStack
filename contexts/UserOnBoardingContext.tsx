import React, { createContext, useContext, useState } from "react";
type UserOnboarding = {
  firstName: string;
  lastName?: string;
  nickName?: string;
  image: string;
  sessionId: string;
  companyName: string; // ✅ add companyName
  setCompanyName: (name: string) => void; // ✅ add setter
  setSessionId: (name: string) => void;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setNickName: (name: string) => void;
  setImage: (image: string) => void;
};

const UserOnboardingContext = createContext<UserOnboarding | null>(null);

export const UserOnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");
  const [image, setImage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [companyName, setCompanyName] = useState(""); // ✅ new state

  return (
    <UserOnboardingContext.Provider
      value={{
        firstName,
        lastName,
        nickName,
        image,
        sessionId,
        companyName, // ✅ provide
        setCompanyName, // ✅ provide setter
        setFirstName,
        setLastName,
        setNickName,
        setSessionId,
        setImage,
      }}
    >
      {children}
    </UserOnboardingContext.Provider>
  );
};

export const useUserOnboarding = () => {
  const ctx = useContext(UserOnboardingContext);
  if (!ctx)
    throw new Error("UserOnboardingContext must be used within a provider");
  return ctx;
};
