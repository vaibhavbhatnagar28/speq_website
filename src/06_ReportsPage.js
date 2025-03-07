import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function ReportsPage() {
  const { groupId } = useParams();
  const [reports, setReports] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      const reportsRef = collection(doc(db, "groups", groupId), "reports");
      const querySnapshot = await getDocs(reportsRef);
      const reportsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsList);
    };

    fetchReports();
  }, [groupId]);

  const handleUpload = async () => {
    if (fileName && fileUrl) {
      const reportsRef = collection(doc(db, "groups", groupId), "reports");
      await addDoc(reportsRef, {
        reportName: fileName,
        reportURL: fileUrl,
        timestamp: serverTimestamp(),
      });
      setFileName("");
      setFileUrl("");
      alert("Report uploaded!");
      window.location.reload();
    }
  };

  const handleDelete = async (reportId) => {
    await deleteDoc(doc(db, "groups", groupId, "reports", reportId));
    alert("Report deleted!");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports for Group: {groupId}</h2>

      {/* Upload Form */}
      <div>
        <input
          type="text"
          placeholder="Report Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Report URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleUpload} style={{ background: "#007bff", color: "white" }}>Upload</button>
      </div>

      {/* List of Reports */}
      <ul style={{ marginTop: "20px" }}>
        {reports.map((report) => (
          <li key={report.id} style={{ marginBottom: "10px" }}>
            <a href={report.reportURL} target="_blank" rel="noopener noreferrer">
              {report.reportName}
            </a>
            <button
              onClick={() => handleDelete(report.id)}
              style={{ marginLeft: "10px", background: "red", color: "white" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportsPage;
