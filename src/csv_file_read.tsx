import Papa from "papaparse";

interface CsvRow {
  "ROA Agent ID": string;
  "Full Name": string;
  "Agent Status": string;
  "Primary State"?: string;
  "Sponsor Name": string;
  "ROA Agent Sponsor ID": string;
  "Sponsor Status": string;
}

interface Node {
  key: string;
  text: string;
  parent?: string;
  color: string;
}

// This function will be triggered by the file input change
export function parseCsvToJson(file: File): Promise<Node[]> {
  return new Promise((resolve) => {
    const nodes: Map<string, Node> = new Map();

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const rows = results.data as CsvRow[];

        rows.forEach((row) => {
          const state = row["Primary State"] ?? "";
          const node: Node = {
            key: row["ROA Agent ID"],
            text: row["Full Name"] + " (" + state + ")",
            parent: row["ROA Agent Sponsor ID"] || undefined,
            color: determineColor(row["Agent Status"]),
          };
          nodes.set(node.key, node);
        });

        const filteredNodes = Array.from(nodes.values()).filter((node) => {
          return (
            (node.parent && nodes.has(node.parent)) ||
            Array.from(nodes.values()).some((n) => n.parent === node.key)
          );
        });

        console.log(nodes);
        console.log(JSON.stringify(filteredNodes, null, 2));

        resolve(filteredNodes);
      },
      error: (error: any) => {
        console.error("Error parsing CSV:", error);
      },
    });
  });
}

// Function to determine color based on agent status
function determineColor(status: string): string {
  switch (status) {
    case "active":
      return "lightgreen";
    case "invite_sent":
      return "orange";
    case "new":
      return "gray";
    case "application_in_progress":
      return "yellow";
    case "waiting_for_approval":
      return "lightblue";
    case "rejected":
      return "pink";
    default:
      return "pink";
  }
}
