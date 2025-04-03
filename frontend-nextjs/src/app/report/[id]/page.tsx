"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Automation } from "@/type/automation";
import { Button } from "@/components/ui/button";
import { fetchAutomationById, fetchMaintenanceByAutomationId } from "./action";


export default function AutomationReportPage() {
  const { id } = useParams();
  const reportRef = useRef<HTMLDivElement>(null);
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [maintenanceList, setMaintenanceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const autoData = await fetchAutomationById(id as string);
      const maintData = await fetchMaintenanceByAutomationId(id as string);
      setAutomation(autoData);
      setMaintenanceList(maintData);
      setLoading(false);
    }
  
    if (id) fetchData();
  }, [id]);
  

  const exportPDF = () => {
    if (reportRef.current) {
      html2pdf()
        .from(reportRef.current)
        .set({
          filename: `automation-report-${id}.pdf`,
          margin: 10,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!automation) return <div className="p-6">Automation not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Automation Report</h1>

      <div
        ref={reportRef}
        className="bg-white text-sm p-6 rounded shadow max-w-3xl space-y-6 border"
      >
        {/* Automation Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Automation Details</h2>
          <p><strong>ID:</strong> {automation.automation_id}</p>
          <p><strong>Name:</strong> {automation.name}</p>
          <p><strong>Description:</strong> {automation.description}</p>
          <p><strong>Status:</strong> {automation.status}</p>
          <p><strong>Created At:</strong> {new Date(automation.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(automation.updated_at).toLocaleString()}</p>
        </div>

        {/* Maintenance Table */}
        {maintenanceList.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Maintenance Records</h2>
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Issue</th>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceList.map((mtn) => (
                  <tr key={mtn.maintenance_id}>
                    <td className="border p-2">{mtn.maintenance_id}</td>
                    <td className="border p-2">{mtn.issue_report}</td>
                    <td className="border p-2">{new Date(mtn.date).toLocaleDateString()}</td>
                    <td className="border p-2">{mtn.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Button onClick={exportPDF}>Export as PDF</Button>
    </div>
  );
}
