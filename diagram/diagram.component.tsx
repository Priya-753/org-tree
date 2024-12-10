import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import React from 'react';

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
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  public componentWillUnmount() {
    const diagram = this.diagramRef.current?.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  private initDiagram(): go.Diagram {
    // const diagram = new go.Diagram({
    //   isReadOnly: true,
    //   'undoManager.isEnabled': true,
    //   'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
    //   layout: new go.TreeLayout({
    //     angle: 90,
    //     layerSpacing: 50,
    //     nodeSpacing: 50
    //   }),
    //   model: new go.TreeModel({
    //     // Optional function to ensure unique keys are generated
    //     makeUniqueKeyFunction: (m: go.Model, data: any) => {
    //       let k = data.key || 1;
    //       while (m.findNodeDataForKey(k)) k++;
    //       data.key = k;
    //       return k;
    //     },
    //   })
    // });

    // diagram.nodeTemplate = new go.Node('Auto')
    //   .bind(new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify))
    //   .add(
    //     new go.Shape('RoundedRectangle', {
    //       name: 'SHAPE',
    //       fill: 'white',
    //       strokeWidth: 0,
    //       portId: '',
    //       fromLinkable: true,
    //       toLinkable: true,
    //       cursor: 'pointer'
    //     }).bind(new go.Binding('fill', 'color')),
    //     new go.TextBlock({
    //       margin: 8,
    //       editable: true,
    //       font: '400 .875rem Roboto, sans-serif'
    //     }).bind(new go.Binding('text').makeTwoWay())
    //   );

    // diagram.linkTemplate = new go.Link()
    //   .bind(new go.Binding('relinkableFrom', 'canRelink'))
    //   .bind(new go.Binding('relinkableTo', 'canRelink'))
    //   .add(new go.Shape(), new go.Shape({ toArrow: 'Standard' }));

    // diagram.addDiagramListener("TreeExpanded", (e) => {
    //     const node = e.subject.findTreeParent();
    //     if (node !== null) {
    //       node.isTreeExpanded = !node.isTreeExpanded;
    //     }
    //   });

    const diagram = new go.Diagram({
      isReadOnly: true,
      'undoManager.isEnabled': true,
      'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
      layout: new go.TreeLayout({
        angle: 90, // Parent-child relationship flows top-to-bottom
        layerSpacing: 100,
      }),
      model: new go.GraphLinksModel({
        linkKeyProperty: "id", // Specify the unique key property for links
        makeUniqueKeyFunction: (m, data) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
      }),
    });
    
    // Node template
    // diagram.nodeTemplate = new go.Node('Auto')
    //   .bind(new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify))
    //   .add(
    //     new go.Shape('RoundedRectangle', {
    //       name: 'SHAPE',
    //       fill: 'white',
    //       strokeWidth: 0,
    //       portId: '',
    //       fromLinkable: true,
    //       toLinkable: true,
    //       cursor: 'pointer'
    //     }).bind(new go.Binding('fill', 'color')),
    //     new go.TextBlock({
    //       margin: 8,
    //       editable: true,
    //       font: '400 .875rem Roboto, sans-serif'
    //     }).bind(new go.Binding('text').makeTwoWay()),
    //   );

    diagram.nodeTemplate = createNodeWithTreeExpander(new go.Shape('RoundedRectangle', {
      name: 'SHAPE',
      fill: 'white',
      strokeWidth: 0,
      portId: '',
      fromLinkable: true,
      toLinkable: true,
      cursor: 'pointer'
    }).bind(new go.Binding('fill', 'color')), new go.TextBlock({
      margin: 8,
      editable: true,
      font: '400 .875rem Roboto, sans-serif'
    }).bind(new go.Binding('text').makeTwoWay()));
    
    // Link template with right-angled links
    diagram.linkTemplate = new go.Link({
      routing: go.Link.Orthogonal, // Ensures links are right-angled
      corner: 10                   // Smooth corner for right-angled links
    })
      .bind(new go.Binding('relinkableFrom', 'canRelink'))
      .bind(new go.Binding('relinkableTo', 'canRelink'))
      .add(new go.Shape(), new go.Shape({ toArrow: 'Standard' }));
    
    // Group template with GridLayout for child nodes
    diagram.groupTemplate = new go.Group('Vertical', {
      layout: new go.GridLayout({
        wrappingColumn: 5, // Wrap children after 5 nodes
        spacing: new go.Size(20, 20) // Spacing between nodes
      }),
      isSubGraphExpanded: true, // Ensure children are visible by default
      subGraphExpandedChanged: (group) => {
        // Update layout when a group is expanded/collapsed
        // group.layout.invalidateLayout();
      }
    })
      .add(
        new go.TextBlock({
          alignment: go.Spot.Top,
          font: 'bold 10pt sans-serif',
          margin: new go.Margin(5, 5, 5, 5)
        }).bind(new go.Binding('text', 'key')), // Display group key
        new go.Placeholder({ padding: 10 }) // Placeholder for child nodes
      );
    
    // Tree expansion logic
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

const $ = go.GraphObject.make;
const createNodeWithTreeExpander = (
  shape: go.GraphObject,
  text: go.GraphObject
): go.Part => {
  return $(
    'Node',
    'Auto',
    // { fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides, visible: true },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // new go.Binding('isCollapsed').makeTwoWay(),
    // new go.Binding('visible', 'visible', (visible) =>
    //   visible !== undefined ? visible : true
    // ).makeTwoWay(),
    $(
      go.Panel,
      'Vertical',
      $(go.Panel, 'Horizontal', $(go.Panel, 'Auto', shape, text)),
      $(
        'Button', // a replacement for "TreeExpanderButton" that works for non-tree-structured graphs
        // assume initially not visible because there are no links coming out
        { visible: false },
        // bind the button visibility to whether it's not a leaf node
        new go.Binding('visible', 'isTreeLeaf', (leaf) => !leaf).ofObject(),
        $(
          go.Shape,
          {
            name: 'ButtonIcon',
            figure: 'MinusLine',
            desiredSize: new go.Size(10, 10),
          },
          new go.Binding('figure', 'icon').makeTwoWay()
        ),
        {
          click: (e, obj) => {
            e.diagram.layout.isOngoing = true;
            expandCollapse(e.diagram, obj.part as go.Node);
            e.diagram.layout.isOngoing = false;
          },
        }
      )
    )
  );
};

export const expandCollapse = (diagram: go.Diagram, node: go.Node) => {
  const visited = new Set<string>();
  if (node.data.isCollapsed) {
    expandFrom(node, node, visited);
  } else {
    collapseFrom(node, node, visited);
  }
};

export const calculateNodeVisibility = (nodes: go.Iterator<go.Node>) => {
  nodes.each((node) => {
    if (!(node instanceof go.Group)) {
      node.visible =
        node.findLinksConnected().any((link) => link.isVisible()) ||
        node.findNodesOutOf().any((node) => node.isVisible());
    }
  });
};

const toggleNodeVisibility = (node: go.Node, visible: boolean) => {
  node.findLinksOutOf().each((l) => {
    l.visible = visible;
  });
};

// Function to expand all children of a node
const expandFrom = (node: go.Node, start: go.Node, visited: Set<string>) => {
  if (!node.data.isCollapsed) {
    return;
  }
  const key = node.key?.toString() || '';
  if (visited.has(key)) {
    return;
  }
  visited.add(key);

  node.data.isCollapsed = false;
  node.diagram?.model.setDataProperty(node.data, 'icon', 'MinusLine');
  toggleNodeVisibility(node, true);

  node.findNodesOutOf().each((childNode) => {
    if (childNode !== start) {
      expandFrom(childNode, start, visited);
      childNode.visible = true;
    }
  });
};

// Function to collapse all children of a node
const collapseFrom = (node: go.Node, start: go.Node, visited: Set<string>) => {
  if (node.data.isCollapsed) {
    return;
  }
  const key = node.key?.toString() || '';
  if (visited.has(key)) {
    return;
  }
  visited.add(key);

  node.data.isCollapsed = true;
  node.diagram?.model.setDataProperty(node.data, 'icon', 'PlusLine');
  toggleNodeVisibility(node, false);

  node.findNodesOutOf().each((childNode) => {
    if (childNode !== start) {
      childNode.visible = false;
      childNode.findNodesInto().each((parentNode) => {
        if (
          !parentNode.data.isCollapsed
        )
          childNode.visible = true;
      });
    }
    if (!childNode.visible) {
      collapseFrom(childNode, start, visited);
    }
  });
};