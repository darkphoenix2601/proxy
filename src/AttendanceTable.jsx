import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const students = [
  { id: 1, name: "Anubhav Raj" },
  { id: 2, name: "Anubhav Singh" },
  { id: 3, name: "Anushka Sharma" },
  { id: 50, name: "Khurshid Alam" },
  { id: 51, name: "Khushbu Kumari" },
  { id: 52, name: "Khushi Kumari" },
  { id: 53, name: "Khushi Pathak" },
  { id: 55, name: "Krish Kumar" },
];

export default function AttendanceTable() {
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // default today
  );
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("attendanceHistory") || "[]")
  );

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const saveAttendance = () => {
    const record = {
      date,
      data: students.map((student) => ({
        RollNo: student.id,
        Name: student.name,
        Status: attendance[student.id] ? "Present" : "Absent",
      })),
    };

    // 1. Save to Excel
    const worksheet = XLSX.utils.json_to_sheet(record.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, `Attendance_${record.date}.xlsx`);

    // 2. Save to Local Storage (History)
    const updatedHistory = [...history, record];
    setHistory(updatedHistory);
    localStorage.setItem("attendanceHistory", JSON.stringify(updatedHistory));

    alert("✅ Attendance saved successfully!");
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* Date Picker */}
      <div className="flex items-center space-x-3 mb-4">
        <label className="font-semibold text-gray-700">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 rounded-lg shadow mb-4">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border">Roll No</th>
              <th className="py-3 px-6 text-left border">Name</th>
              <th className="py-3 px-6 text-center border">Present</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap border">{student.id}</td>
                <td className="py-3 px-6 text-left border">{student.name}</td>
                <td className="py-3 px-6 text-center border">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={attendance[student.id] || false}
                    onChange={() => toggleAttendance(student.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-center my-4">
        <button
          onClick={saveAttendance}
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 shadow-md transition-colors duration-200"
        >
          Save Attendance
        </button>
      </div>

      {/* Attendance History */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-3 text-gray-700">📜 Attendance History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-center border">Date</th>
                  <th className="py-3 px-6 text-center border">Summary</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {history.map((record, i) => {
                  const presentCount = record.data.filter(
                    (r) => r.Status === "Present"
                  ).length;
                  return (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-center border">{record.date}</td>
                      <td className="py-3 px-6 text-center border">
                        {presentCount} / {record.data.length} Present
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
