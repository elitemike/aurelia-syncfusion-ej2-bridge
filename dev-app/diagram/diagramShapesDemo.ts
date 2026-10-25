export class DiagramShapesDemo {
  // UML sequence diagram, the `model` option
  sequence = {
    spaceBetweenParticipants: 160,
    participants: [
      { id: 'User', content: 'User', isActor: true },
      { id: 'Web', content: 'Web app' },
      { id: 'Db', content: 'Database' }
    ],
    messages: [
      { id: 'sm1', content: 'Login', fromParticipantID: 'User', toParticipantID: 'Web' },
      { id: 'sm2', content: 'Query', fromParticipantID: 'Web', toParticipantID: 'Db' },
      { id: 'sm3', content: 'Rows', fromParticipantID: 'Db', toParticipantID: 'Web', type: 'Reply' }
    ]
  };

  bpmnNodes: any[] = [
    { id: 'bstart', offsetX: 60, offsetY: 120, width: 40, height: 40, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start' } } },
    { id: 'btask', offsetX: 190, offsetY: 120, width: 100, height: 60, shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task' } }, annotations: [{ content: 'Review' }] },
    { id: 'bgate', offsetX: 320, offsetY: 120, width: 50, height: 50, shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } } },
    { id: 'bend', offsetX: 440, offsetY: 120, width: 40, height: 40, shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End' } } }
  ];
  bpmnConnectors: any[] = [
    { id: 'bc1', sourceID: 'bstart', targetID: 'btask', type: 'Orthogonal', shape: { type: 'Bpmn', flow: 'Sequence' } },
    { id: 'bc2', sourceID: 'btask', targetID: 'bgate', type: 'Orthogonal', shape: { type: 'Bpmn', flow: 'Sequence' } },
    { id: 'bc3', sourceID: 'bgate', targetID: 'bend', type: 'Orthogonal', shape: { type: 'Bpmn', flow: 'Sequence', sequence: 'Conditional' } }
  ];

  swimNodes: any[] = [{
    id: 'swim', offsetX: 300, offsetY: 140, width: 520, height: 200,
    shape: {
      type: 'SwimLane', orientation: 'Horizontal', header: { annotation: { content: 'Order process' }, height: 40 },
      lanes: [
        {
          id: 'laneA', height: 80, header: { annotation: { content: 'Customer' }, width: 40 },
          children: [{ id: 'swimTask1', annotations: [{ content: 'Order' }], margin: { left: 80, top: 20 }, height: 40, width: 100 }]
        },
        {
          id: 'laneB', height: 80, header: { annotation: { content: 'Shop' }, width: 40 },
          children: [{ id: 'swimTask2', annotations: [{ content: 'Ship' }], margin: { left: 240, top: 20 }, height: 40, width: 100 }]
        }
      ]
    }
  }];

  umlNodes: any[] = [{
    id: 'person', offsetX: 150, offsetY: 140,
    shape: {
      type: 'UmlClassifier', classShape: {
        name: 'Person',
        attributes: [{ name: 'name', type: 'string' }, { name: 'age', type: 'int' }],
        methods: [{ name: 'save', type: 'void' }]
      }, classifier: 'Class'
    }
  }];
}
