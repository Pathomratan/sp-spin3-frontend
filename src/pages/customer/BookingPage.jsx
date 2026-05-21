import React, { useState } from 'react';
import BranchSelector from '../../component/customer/BranchSelector';
import SummaryInform from '../../component/customer/SummaryInform';
import { useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const navigate = useNavigate();

  const [orderState, setOrderState] = useState({
    type: 'Booking',
    branch: null,
    date: new Date().toISOString().split('T')[0],
    time: '13:00-15:00',
    member: '5P',
    userAddress: '', 
  });

  const [profile, setProfile] = useState({
    name: 'MR. PERSESS',
    email: 'test@gmail.com',
    contact: '+66 258423381123'
  });

  // ฟังก์ชันสำหรับกดปุ่ม Confirm Order แล้วไปหน้า Payment
  const goToCheckout = () => {
    navigate("/payment", { // เปลี่ยนลิงก์ให้ตรงกับ Router ของหน้า PaymentPage
      state: { 
        bookingDate: orderState.date, // ส่งข้อมูลวันที่
        bookingTime: orderState.time, // ส่งข้อมูลเวลา (เพิ่มเติมได้)
        branch: orderState.branch
      } 
    });
  };

  const handleSelectBranch = (branchName) => {
    setOrderState(prev => ({ ...prev, branch: branchName }));
  };

  const handleUpdateAddress = (address) => {
    setOrderState(prev => ({ ...prev, userAddress: address }));
  };

  return (
    <div className="bg-brand-gray text-brand-black font-sans-thai pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto pt-10 px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <BranchSelector 
          onSelectBranch={handleSelectBranch} 
          onUpdateAddress={handleUpdateAddress}
        />
        <SummaryInform
          orderState={orderState} 
          setOrderState={setOrderState} 
          profile={profile} 
          setProfile={setProfile} 
          onConfirm={goToCheckout} // ส่งฟังก์ชันไปให้ปุ่ม Confirm ในคอมโพเนนต์นี้
        />
      </div>
    </div>
  );
}