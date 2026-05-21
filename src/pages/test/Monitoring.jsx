import { useState, useEffect } from "react";

export const Monitoring = () => {
  const [status, setStatus] = useState("Checking...");
  const [backendData, setBackendData] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    // Test health endpoint
    fetch(`${import.meta.env.VITE_API_TEST_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        setStatus("Connected ✅");
        setBackendData(data);
      })
      .catch((err) => {
        setStatus("Failed to connect ❌");
        console.error(err);
      });

    // Test database endpoint
    fetch(`${import.meta.env.VITE_API_TEST_URL}/db-test`)
      .then((res) => res.json())
      .then((data) => {
        setDbStatus(data);
      })
      .catch((err) => {
        console.error("DB test failed:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">PosQ 🚀</h1>
          <p className="text-gray-600 mt-1">
            Point of Sale System with Multi-Branch
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-medium w-32">Frontend:</span>
              <span className="text-green-600">Running on Port 5173 ✅</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium w-32">Backend:</span>
              <span
                className={
                  status === "Connected ✅" ? "text-green-600" : "text-red-600"
                }
              >
                {status}
              </span>
            </div>

            {backendData && (
              <div className="flex items-center gap-3">
                <span className="font-medium w-32">Backend Version:</span>
                <span>{backendData.version}</span>
              </div>
            )}

            {dbStatus && (
              <div className="flex items-center gap-3">
                <span className="font-medium w-32">Database:</span>
                <span
                  className={
                    dbStatus.success ? "text-green-600" : "text-red-600"
                  }
                >
                  {dbStatus.success ? "Connected ✅" : "Failed ❌"}
                </span>
                {dbStatus.branchCount !== undefined && (
                  <span className="text-sm text-gray-500">
                    ({dbStatus.branchCount} branches)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Project Info</h2>
          <div className="space-y-2 text-gray-600">
            <p>📦 Tech Stack:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
              </li>
              <li>Frontend: React + Vite + Tailwind CSS</li>
              <li>Real-time: Socket.io (akan datang)</li>
            </ul>
            <p className="mt-4">🎯 Features to build:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Authentication & Role Management</li>
              <li>Multi-branch Management</li>
              <li>Product & Category Management</li>
              <li>Transaction (Sales & Purchases)</li>
              <li>Stock Management & Real-time Updates</li>
              <li>Reports Dashboard</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Monitoring;
