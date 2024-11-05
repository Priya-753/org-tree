import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import React from "react";

// Props passed in from a parent component holding state, some of which will be passed to ReactDiagram
interface WrapperProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<WrapperProps> {
  private diagramRef: React.RefObject<ReactDiagram>;

  constructor(props: WrapperProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  public componentDidMount() {
    const diagram = this.diagramRef.current?.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", this.props.onDiagramEvent);
    }
  }

  public componentWillUnmount() {
    const diagram = this.diagramRef.current?.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener(
        "ChangedSelection",
        this.props.onDiagramEvent
      );
    }
  }

  private initDiagram(): go.Diagram {
    const diagram = new go.Diagram({
      isReadOnly: true,
      "undoManager.isEnabled": true,
      "clickCreatingTool.archetypeNodeData": {
        text: "new node",
        color: "lightblue",
      },
      layout: new go.TreeLayout({
        angle: 90,
        layerSpacing: 50,
        nodeSpacing: 50,
      }),
      model: new go.TreeModel({
        // Optional function to ensure unique keys are generated
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
      }),
    });

    diagram.nodeTemplate = new go.Node("Auto")
      .bind(
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        )
      )
      .add(
        new go.Shape("RoundedRectangle", {
          name: "SHAPE",
          fill: "white",
          strokeWidth: 0,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
        }).bind(new go.Binding("fill", "color")),
        new go.TextBlock({
          margin: 8,
          editable: true,
          font: "400 .875rem Roboto, sans-serif",
        }).bind(new go.Binding("text").makeTwoWay())
      );

    diagram.linkTemplate = new go.Link()
      .bind(new go.Binding("relinkableFrom", "canRelink"))
      .bind(new go.Binding("relinkableTo", "canRelink"))
      .add(new go.Shape(), new go.Shape({ toArrow: "Standard" }));

    diagram.addDiagramListener("TreeExpanded", (e) => {
      const node = e.subject.findTreeParent();
      if (node !== null) {
        node.isTreeExpanded = !node.isTreeExpanded;
      }
    });

    return diagram;
  }

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName="diagram-component"
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}
