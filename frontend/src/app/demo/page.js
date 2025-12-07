"use client";

import React, { useState } from "react";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";
import ReactQuillViewer from "@/components/editor/ReactQuillViewer";

export default function SmallEditorDemo() {
  const [html, setHtml] = useState("<p>Start writing...</p>");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <ReactQuillEditor value={html} onChange={(val) => setHtml(val)} />
      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <h4>Viewer</h4>
        <ReactQuillViewer value={html} />
      </div>
    </div>
  );
}
