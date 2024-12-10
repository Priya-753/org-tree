// "use client";
// import React, { useCallback, useMemo, useRef, useState } from 'react';
// import TreeLayout from './sponsor_agent';
// import { parseCsvToJson } from '@/csv_file_read';
// import 'ag-grid-enterprise';
// import { AgGridReact } from 'ag-grid-react';
// import { useRouter } from 'next/router';
// import Link from '../../link/link.component';
// import get from 'lodash.get';
// import { AG_GRID_OPTIONS, DEFAULT_COLUMN_DEFINITIONS } from '../../consts';

// const ParentComponent: React.FC = () => {
//   const [nodes, setNodes] = useState<any[]>([]);
//   const [links, setLinks] = useState<any[]>([]);
  
//   // Function to handle file input change
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       parseCsvToJson(file).then((graphStructure) => {
//         setNodes(graphStructure.nodes);
//         setLinks(graphStructure.links);
//       });
//     }
//   };

//   const router = useRouter();
//   const agGridRef = useRef<AgGridReact>();

//   const colDefs = [
//     {
//       cellRenderer: useCallback((params: any) => renderLink(params), []),
//       cellRendererParams: {
//           // Navigate to group overview
//           callback: async (r: any) => {
//               viewSponsorTree(r)
//           },
//           dataKeyName: 'Name',
//           linkPrefix: '/patient',
//       },
//       externalFilter: 'list',
//       field: 'Name',
//       filter: 'agSetColumnFilter',
//       headerName: 'Agent Name',
//   },
//   {
//     externalFilter: 'list',
//     field: 'AgentNumber',
//     filter: 'agSetColumnFilter',
//     headerName: 'Agent Number',
// },
//   ];

//   const viewSponsorTree = (row: any) => {
//     router.push(`/page/${row.AptNum}`);
//   };

//   return (
//     <div>
//       <input type="file" accept=".csv" onChange={handleFileChange} />
//       <AgGridReact
//           {...AG_GRID_OPTIONS}
//           columnDefs={useMemo(() => colDefs, [])}
//           defaultColDef={useMemo(() => {
//             return {
//               ...DEFAULT_COLUMN_DEFINITIONS,
//               flex: 1,
//             };
//           }, [])}
//           rowData={[]}
//           ref={agGridRef}
//         />
//     </div>
//   );
// };

// export default ParentComponent;

// export const renderLink = (params: any) => {
//   const {
//     colDef: {
//       cellRendererParams: {
//         callback,
//         dataKeyName,
//         keyPrefix,
//         linkPrefix,
//         optionalDataKeyName,
//       },
//     },
//     data,
//   } = params;

//   return (
//     <Link
//       href={`${linkPrefix}/${data?.id}`}
//       key={`${keyPrefix}-${data?.id}`}
//       onClick={(e) => {
//         e.preventDefault();
//         callback(data);
//       }}
//     >
//       {get(data, optionalDataKeyName) ?? get(data, dataKeyName)}
//     </Link>
//   );
// };

