export interface ProcessResult {
    status: string;
    message: string;
    data?: unknown;
}

export interface ProcessedData {
    status: string;
    message: string;
    result?: unknown;
}
