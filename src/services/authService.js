// จำลองการเรียก API ขึ้นมาคั่นกลาง เวลาย้ายไปใช้ B/E จะได้แก้แค่ไฟล์นี้ไฟล์เดียว

import { usersInfo } from "../assets/usersInfo";

console.log("Check Data:", usersInfo);

export const loginAPI = async (username, password) => {
  // จำลองความหน่วงของเน็ต 1 วินาที (1000 ms)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const user = usersInfo.find(
          (u) => u.username === username && u.password === password,
        );

        if (user) {
          console.log("Login Success:", user);
          resolve(user);
        } else {
          reject(new Error("Username หรือ Password ไม่ถูกต้อง"));
        }
      } catch (err) {
        // ป้องกันกรณีตัวแปร usersInfo พังหรือ import พลาด
        console.error("Auth Service Error:", err);
        reject(new Error("ระบบตรวจสอบข้อมูลขัดข้อง"));
      }
    }, 1000);
  });
};
