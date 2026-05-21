// คอยจำว่า "ตอนนี้ใคร Login อยู่" โดยดึงข้อมูลจาก localStorage

import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  // Added safe parsing (try-catch) and null check.
  // Prevents "Unexpected end of JSON input" error when localStorage is empty for new users.
  const [myUserInfo, setMyUserInfo] = useState(() => {
    try {
      const savedUser = localStorage.getItem("userInfo");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      return null;
    }
  });

  // Sync state changes to localStorage.
  // Added condition to remove item on logout instead of saving the string "null".
  useEffect(() => {
    if (myUserInfo === null || myUserInfo === undefined) {
      localStorage.removeItem("userInfo");
    } else {
      localStorage.setItem("userInfo", JSON.stringify(myUserInfo));
    }
  }, [myUserInfo]);

  return (
    <UserContext.Provider value={{ myUserInfo, setMyUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
