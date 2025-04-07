/**
 * SystemControlAdapter - TypeScript wrapper for System Control Plugin REST API
 */

interface ControlResponse {
  status: 'success' | 'error';
  result?: string;
  [key: string]: unknown;
}

export class SystemControlAdapter {
  private apiBaseUrl: string;

  constructor(apiBaseUrl = '/control') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async typeText(text: string): Promise<ControlResponse> {
    return this._post('/type', { text });
  }

  async moveMouse(x: number, y: number): Promise<ControlResponse> {
    return this._post('/mouse', { x, y });
  }

  async openApp(appPath: string): Promise<ControlResponse> {
    return this._post('/launch', { appPath });
  }

  async closeApp(appName: string): Promise<ControlResponse> {
    return this._post('/close', { appName });
  }

  async runScript(script: string): Promise<ControlResponse> {
    return this._post('/script', { script });
  }

  async takeScreenshot(): Promise<Blob> {
    const response = await fetch(`${this.apiBaseUrl}/screenshot`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Screenshot failed');
    return response.blob();
  }

  private async _post(endpoint: string, data: Record<string, unknown>): Promise<ControlResponse> {
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Request failed: ${endpoint}`);
    return response.json();
  }
}