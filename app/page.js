"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generatePDF() {
    if (!url.trim()) {
      setMessage("Please paste an Instagram post URL.");
      return;
    }

    setLoading(true);
    setMessage("Creating your PDF...");

    try {
      const response = await fetch("/api/instagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "PDF generation failed.");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "UPSC-Notes.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setMessage("PDF created successfully! 🎉");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "45px" }}>📚</div>

          <h1
            style={{
              margin: "10px 0",
              fontSize: "30px",
              color: "#172033",
            }}
          >
            UPSC Notes → PDF
          </h1>

          <p
            style={{
              color: "#667085",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            Convert an Instagram carousel into one clean PDF.
          </p>
        </div>

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#344054",
          }}
        >
          Instagram Post URL
        </label>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              generatePDF();
            }
          }}
          placeholder="https://www.instagram.com/p/..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "15px",
            border: "1px solid #d0d5dd",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
            marginBottom: "15px",
          }}
        />

        <button
          onClick={generatePDF}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "10px",
            background: loading ? "#98a2b3" : "#2563eb",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating PDF..." : "Create PDF"}
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "18px",
              color: "#475467",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            background: "#f8fafc",
            borderRadius: "10px",
            textAlign: "center",
            color: "#667085",
            fontSize: "13px",
          }}
        >
          One Instagram carousel → One PDF
        </div>
      </div>
    </main>
  );
}