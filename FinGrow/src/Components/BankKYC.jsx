import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import Loaninfo from './LoanInfo';
import Progressbar from './ProgressBar';
import { useSearchParams } from "react-router-dom";

const BankDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const amount = searchParams.get("amount") || "50000";
  const totalRepayment = searchParams.get("totalRepayment") || "55000";
  const firstName = searchParams.get("firstName") || "Nikhiil";
  const lastName = searchParams.get("lastName") || "Kumarar";
  const address = searchParams.get("address") || "1232 civil city, Ludhiana, Punjab, India, 141000";
  const monthlyIncome = Number(searchParams.get("monthlyIncome") || "70000");
  const email = searchParams.get("email") || "Nikhiil.doe@example.com";
  const panid = searchParams.get("pan") || "ABCDE1890F";
  const aadhaarid = searchParams.get("aadhaar") || "123450227092";
  const repaymentDate = searchParams.get("repaymentDate")

  const [accountno, setAccountNumber] = useState("103422707012");
  const [IFSCcode, setIfscCode] = useState("HDFC0001028");
  const [bankname, setBankName] = useState("HDFC Bank");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountno || !IFSCcode || !bankname) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setIsLoading(true);

    let parsedAddress;
    try {
      const [street, city, state, country, postalCode] = address.split(',').map(part => part.trim());
      parsedAddress = { street, city, state, country, postalCode };
    } catch (err) {
      setError("Invalid address format. Please use: street, city, state, country, postalCode");
      setIsLoading(false);
      return;
    }

    const kycData = {
      firstname: firstName,
      lastname: lastName,
      address: parsedAddress,
      monthlyIncome, // Ensure it's sent as a number
      panid, // Match backend field names
      aadhaarid,
      accountno,
      IFSCcode,
      bankname,
      email,
      phone: "9876543210"
    };

    try {
      console.log('Sending request to:', '/api/v1/users/kyc');
      console.log('Data:', kycData);
      const response = await axios.post("/api/v1/users/kyc", kycData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log('KYC submission successful:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error submitting KYC:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Failed to submit details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-5">
      <Loaninfo amount={amount} totalRepayment={totalRepayment} />
      <Progressbar currentStep={4} />
      <div className="bg-white p-6 rounded-lg shadow-md w-[800px]">
        <h2 className="text-center font-bold text-2xl mb-8">Bank Account Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-bold">Account Number:*</label>
          <input
            type="text"
            value={accountno}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full p-2 border-b-2 border-black outline-none"
            disabled={isLoading}
          />
          <label className="block font-bold">IFSC Code:*</label>
          <input
            type="text"
            value={IFSCcode}
            onChange={(e) => setIfscCode(e.target.value)}
            className="w-full p-2 border-b-2 border-black outline-none"
            disabled={isLoading}
          />
          <label className="block font-bold">Bank Name:*</label>
          <input
            type="text"
            value={bankname}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full p-2 border-b-2 border-black outline-none"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="flex justify-between mt-4">
            <Link to={`/Aadhar-verify?amount=${amount}&totalRepayment=${totalRepayment}`}>
              <button 
                className="px-8 py-4 bg-red-500 text-white rounded-full transition hover:bg-red-700"
                disabled={isLoading}
              >
                Back
              </button>
            </Link>
            <NavLink 
              to="/LoanConfirmation?amount=${amount}&totalRepayment=${totalRepayment}"
              className="px-8 py-4 bg-blue-500 text-white rounded-full transition hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetails;
