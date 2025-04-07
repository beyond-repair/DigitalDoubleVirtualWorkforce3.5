import * as fs from 'fs';
import * as path from 'path';

interface ModelInfo {
    [key: string]: string | number | boolean | object | null;
}

interface MLData {
    taskHistory: { timestamp: string; value: number }[];
    agentHistory: { timestamp: string; value: number }[];
    modelInfo: ModelInfo;
}

const DATA_FILE = path.join(__dirname, 'ml_data.json');

export class MLDataStore {
    private data: MLData = { taskHistory: [], agentHistory: [], modelInfo: {} };

    constructor() {
        this.load();
    }

    private load(): void {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const raw = fs.readFileSync(DATA_FILE, 'utf-8');
                this.data = JSON.parse(raw);
            }
        } catch (error) {
            console.error('Failed to load ML data store:', error);
        }
    }

    save(): void {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Failed to save ML data store:', error);
        }
    }

    addTaskRecord(timestamp: Date, value: number): void {
        this.data.taskHistory.push({ timestamp: timestamp.toISOString(), value });
        this.save();
    }

    addAgentRecord(timestamp: Date, value: number): void {
        this.data.agentHistory.push({ timestamp: timestamp.toISOString(), value });
        this.save();
    }

    getRecentTasks(days = 1): { timestamp: string; value: number }[] {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return this.data.taskHistory.filter(r => new Date(r.timestamp) >= cutoff);
    }

    getRecentAgents(days = 1): { timestamp: string; value: number }[] {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return this.data.agentHistory.filter(r => new Date(r.timestamp) >= cutoff);
    }

    updateModelInfo(info: ModelInfo): void {
        this.data.modelInfo = { ...this.data.modelInfo, ...info };
        this.save();
    }

    getModelInfo(): ModelInfo {
        return this.data.modelInfo;
    }
}