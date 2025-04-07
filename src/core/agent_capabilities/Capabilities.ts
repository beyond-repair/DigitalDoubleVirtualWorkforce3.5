export interface AgentCapability {
  name: string;
  description: string;
  promptTemplate: string;
  outputType: 'code' | 'text' | 'json' | 'command';
}

export const Capabilities: AgentCapability[] = [
  {
    name: 'Code Generation',
    description: 'Generate code from natural language or specifications.',
    promptTemplate: 'Generate code for the following task:\n{task}',
    outputType: 'code',
  },
  {
    name: 'Bug Detection and Repair',
    description: 'Find and fix bugs in the provided code.',
    promptTemplate: 'Analyze and fix bugs in this code:\n{code}',
    outputType: 'code',
  },
  {
    name: 'Code Refactoring',
    description: 'Improve and refactor the given code.',
    promptTemplate: 'Refactor this code for better readability and performance:\n{code}',
    outputType: 'code',
  },
  {
    name: 'Unit Test Generation',
    description: 'Generate unit tests for the provided code.',
    promptTemplate: 'Write unit tests for this code:\n{code}',
    outputType: 'code',
  },
  {
    name: 'API Integration',
    description: 'Generate code to integrate with the following API.',
    promptTemplate: 'Generate integration code for this API:\n{api_spec}',
    outputType: 'code',
  },
  {
    name: 'Documentation Generation',
    description: 'Generate documentation for the provided code or API.',
    promptTemplate: 'Generate documentation for this code or API:\n{code_or_api}',
    outputType: 'text',
  },
  {
    name: 'Containerization',
    description: 'Create Dockerfiles and container configs.',
    promptTemplate: 'Create a Dockerfile and container setup for this project:\n{project_details}',
    outputType: 'code',
  },
  {
    name: 'CI/CD Pipeline Creation',
    description: 'Generate CI/CD pipeline configuration.',
    promptTemplate: 'Create a CI/CD pipeline for this project:\n{project_details}',
    outputType: 'code',
  },
  {
    name: 'Cross-language Translation',
    description: 'Translate code between programming languages.',
    promptTemplate: 'Translate this code to {target_language}:\n{code}',
    outputType: 'code',
  },
  {
    name: 'Dependency Management',
    description: 'Resolve dependency conflicts and generate dependency maps.',
    promptTemplate: 'Analyze and resolve dependencies for this project:\n{project_details}',
    outputType: 'json',
  }
];