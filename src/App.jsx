import React from "react";
import AttendanceTable from "./AttendanceTable";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎓 College Attendance System</h1>
      <AttendanceTable />
    </div>
  );
}
