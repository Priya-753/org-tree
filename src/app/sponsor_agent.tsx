"use client";
import * as go from 'gojs';
import * as React from 'react';
import { useState, useCallback } from 'react';
import { NextPage } from 'next';
import DiagramWrapper from '../../diagram';

interface Node {
  key: number;
  text: string;
  parent?: number;
  color: string;
}

interface TreeLayoutProps {
  nodes: Node[];
}

const TreeLayout: NextPage<TreeLayoutProps> = ({ nodes }) => {
  
  const [linkDataArray] = useState([
    { key: -1, from: 0, to: 1 },
    { key: -2, from: 0, to: 2 },
    { key: -3, from: 1, to: 1 },
    { key: -4, from: 2, to: 3 },
    { key: -5, from: 3, to: 0 },
  ]);

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
        linkDataArray={linkDataArray}
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
