import { IAgentVisualMetadata } from '../../interfaces/IAgentVisualMetadata';

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// @doc:RoomLayout
// Summary: Manages rooms within the building and assigns agents to rooms.
// TODO: Implement methods to remove rooms and update existing room properties.
export class RoomLayout {
  private rooms: Room[] = [];

  // @doc:addRoom
  // Summary: Adds a new room to the layout.
  // TODO: Add validation to ensure room dimensions and IDs are unique before adding.
  public addRoom(room: Room): void {
    this.rooms.push(room);
    console.debug('[RoomLayout] Added room:', room);
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  // @doc:getRoomForAgent
  // Summary: Retrieves the room assigned to a specific agent.
  // TODO: Handle cases where agent metadata lacks roomId or contains invalid data.
  public getRoomForAgent(agent: IAgentVisualMetadata): Room | undefined {
    if (!agent.roomId) return undefined;
    return this.rooms.find(r => r.id === agent.roomId);
  }

  // @doc:assignAgentToRoom
  // Summary: Assigns an agent to a specified room.
  // TODO: Check if the target room exists before assigning the agent.
  public assignAgentToRoom(agent: IAgentVisualMetadata, roomId: string): void {
    agent.roomId = roomId;
    console.debug(`[RoomLayout] Assigned agent ${agent.agentId} to room ${roomId}`);
  }
}