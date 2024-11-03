"use client";
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import TreeLayout from './sponsor_agent';
import { parseCsvToJson } from '@/csv_file_read';


const ParentComponent: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  
  // Function to handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseCsvToJson(file).then((nodes) => {
        setNodes(nodes);
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <TreeLayout nodes={nodes} />
    </div>
  );
};

export default ParentComponent;
