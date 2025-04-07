import { BuildingView } from '../../../src/ui/building/BuildingView';
import { AgentVisualizerBridge } from '../../../src/ui/building/AgentVisualizerBridge';
import { RoomLayout, Room } from '../../../src/ui/building/RoomLayout';
import { IAgentVisualMetadata } from '../../../src/interfaces/IAgentVisualMetadata';

describe('BuildingView UI Components', () => {
  let buildingView: BuildingView;
  let bridge: AgentVisualizerBridge;
  let roomLayout: RoomLayout;

  beforeEach(() => {
    buildingView = new BuildingView('test-container');
    bridge = new AgentVisualizerBridge('test-container');
    roomLayout = new RoomLayout();
  });

  test('BuildingView should render without errors', () => {
    expect(() => buildingView.render()).not.toThrow();
  });

  test('RoomLayout can add and assign rooms', () => {
    const room: Room = {
      id: 'room1',
      name: 'Test Room',
      x: 0,
      y: 0,
      width: 100,
      height: 100
    };
    roomLayout.addRoom(room);

    const agent: IAgentVisualMetadata = {
      agentId: 'agent1',
      position: { x: 10, y: 20 }
    };
    roomLayout.assignAgentToRoom(agent, 'room1');

    const assignedRoom = roomLayout.getRoomForAgent(agent);
    expect(assignedRoom).toEqual(room);
  });

  test('AgentVisualizerBridge initializes without errors', () => {
    expect(() => bridge.initialize()).not.toThrow();
  });
});