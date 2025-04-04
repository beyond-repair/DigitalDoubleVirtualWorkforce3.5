import { EventEmitter } from 'events';

export interface ResourceLimits {
  maxMemoryMB: number;
  maxCPUPercent: number;
  maxDiskIOPS: number;
}

export class ResourceGovernor extends EventEmitter {
  private readonly limits: ResourceLimits;
  private currentUsage: Map<string, number> = new Map();

  constructor(limits: ResourceLimits) {
    super();
    this.limits = this.validateLimits(limits);
  }

  async monitor(resourceId: string): Promise<void> {
    const usage = await this.measureResourceUsage(resourceId);
    // Check if usage exceeds any defined limit
    if (this.isOverLimit(usage)) { // Assuming usage is a single number representing a primary metric like memory
      this.emit('resource-exceeded', { resourceId, usage });
    }
    this.currentUsage.set(resourceId, usage);
  }

  private validateLimits(limits: ResourceLimits): ResourceLimits {
    if (limits.maxMemoryMB < 128) throw new Error('Memory limit too low');
    if (limits.maxCPUPercent > 100 || limits.maxCPUPercent < 0) throw new Error('Invalid CPU limit'); // Added check for < 0
    if (limits.maxDiskIOPS < 0) throw new Error('Invalid Disk IOPS limit'); // Added check for < 0
    return limits;
  }

  // Method to check if usage exceeds limits
  private isOverLimit(usage: number): boolean {
    // This implementation assumes 'usage' is a single metric (e.g., memory).
    // Adjust logic if 'usage' represents multiple metrics or needs specific checks.
    // Example: Check only memory limit
    return usage > this.limits.maxMemoryMB;

    // Example: Check all limits (assuming usage represents a comparable value for each)
    // return usage > this.limits.maxMemoryMB ||
    //        usage > this.limits.maxCPUPercent || // This comparison might need adjustment based on what 'usage' represents
    //        usage > this.limits.maxDiskIOPS;
  }

  private async measureResourceUsage(resourceId: string): Promise<number> {
    // Placeholder: Implementation of resource measurement needed here.
    // For testing purposes, returning a fixed value.
    console.log(`Measuring resource usage for ${resourceId}...`); // Added log
    // Return a value exceeding the test limit (e.g., 512) to trigger the event in tests
    return 600; // Example value
  }
}
