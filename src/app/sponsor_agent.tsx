"use client";
import * as go from 'gojs';
import * as React from 'react';
import { useState, useCallback } from 'react';
import { NextPage } from 'next';
import DiagramWrapper from '../../diagram';
import { Node, Link } from '@/csv_file_read';


interface TreeLayoutProps {
  nodes: Node[];
  links: Link[];
}

const TreeLayout: NextPage<TreeLayoutProps> = ({ nodes, links }) => {

  const [modelData, setModelData] = useState({ canRelink: true });
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [skipsDiagramUpdate, setSkipsDiagramUpdate] = useState(false);

  const handleDiagramEvent = useCallback((e: go.DiagramEvent) => {
    const sel = e.subject.first();
    setSelectedKey(sel ? sel.key : null);
  }, []);

  const handleModelChange = useCallback((obj: go.IncrementalData) => {
    console.log("Model Change")
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <DiagramWrapper
        nodeDataArray={nodes}
        linkDataArray={links}
        modelData={modelData}
        skipsDiagramUpdate={skipsDiagramUpdate}
        onDiagramEvent={handleDiagramEvent}
        onModelChange={handleModelChange}
      />
      {selectedKey !== null && <p>Selected key: {selectedKey}</p>}
    </div>
  );
};

export default TreeLayout;

// Align
// Count
// Search
// Expansion