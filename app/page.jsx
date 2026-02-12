'use client'
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const { data } = await axios.get(
            `/api/organizations/nearby?lat=${lat}&lng=${lng}&limit=10`
          );
          if (data.success) setOrgs(data.organizations);
          else setError(data.message || "Failed to load organizations");
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message || "Failed to fetch location");
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        <h1 className="text-2xl md:text-3xl font-medium mb-6">
          Nearby organizations and shelters
        </h1>
        {loading && <p>Loading nearby organizations…</p>}
        {error && !loading && (
          <p className="text-red-600">{error}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <div key={org._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{org.name}</h2>
                {org.verified && (
                  <span className="text-green-600 text-sm">✔ Verified</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{org.address}</p>
              {org.distanceMeters !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  {(org.distanceMeters / 1000).toFixed(2)} km away
                </p>
              )}
              <p className="text-sm mt-3 line-clamp-3">{org.description}</p>
              <div className="mt-4">
                {org.verified ? (
                  <Link
                    href={`/organizations/${org._id}/donate`}
                    className="inline-block text-sm bg-black text-white px-4 py-2 rounded-full"
                  >
                    Donate to this organization
                  </Link>
                ) : (
                  <Link
                    href={`/organizations/${org._id}`}
                    className="inline-block text-sm border px-4 py-2 rounded-full"
                  >
                    View details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
