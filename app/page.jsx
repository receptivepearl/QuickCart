'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32 py-12 grid gap-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold mb-3">Go With The Flow</h1>
          <p className="text-gray-700">Ending period poverty by connecting donors to nearby nonprofits and shelters that accept menstrual product donations.</p>
        </div>
        <div>
          <Link href="/organizations" className="inline-block bg-gray-800 text-white px-5 py-3 rounded">Find nearby organizations</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <p className="font-medium mb-1">For donors</p>
            <p className="text-sm text-gray-600">See the nearest 10 organizations and donate in person or place a direct order for verified orgs.</p>
          </div>
          <div className="border rounded p-4">
            <p className="font-medium mb-1">For organizations</p>
            <p className="text-sm text-gray-600">Register your organization to be verified and receive direct donation orders with a simple dashboard.</p>
          </div>
          <div className="border rounded p-4">
            <p className="font-medium mb-1">For administrators</p>
            <p className="text-sm text-gray-600">Approve organizations and track total impact across orders and donated products.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
