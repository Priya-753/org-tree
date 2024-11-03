# CSV to JSON Parser for Tree Visualization

This project includes a TypeScript function that parses a CSV file containing agent data and converts it into a JSON structure suitable for hierarchical tree visualization. The structure supports parent-child relationships based on agent sponsorship.

## Features

- **CSV Parsing**: Efficiently reads and processes large CSV files using the `papaparse` library.
- **JSON Structure**: Converts the CSV data into a structured JSON format for tree diagrams.
- **Parent-Child Relationships**: Only includes nodes that have valid parent or child relationships, eliminating orphan nodes.
- **Dynamic Coloring**: Nodes are color-coded based on their status (Active, Inactive, Pending).

## Prerequisites

- Node.js and npm or Yarn installed on your machine.
- TypeScript installed.
