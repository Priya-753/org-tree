"use client";
import React, { useState } from 'react';
import TreeLayout from './sponsor_agent';
import { parseCsvToJson } from '@/csv_file_read';


const ParentComponent: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  
  // Function to handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseCsvToJson(file).then((graphStructure) => {
        setNodes(graphStructure.nodes);
        setLinks(graphStructure.links);
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <TreeLayout nodes={nodes} links={links} />
    </div>
  );
};

export default ParentComponent;
