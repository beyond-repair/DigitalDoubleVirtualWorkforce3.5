# PowerShell script to move Python files to new structure
$ErrorActionPreference = "Stop"

# Create target directories if they don't exist
New-Item -ItemType Directory -Force -Path src/python/core/ai
New-Item -ItemType Directory -Force -Path src/python/core/compliance
New-Item -ItemType Directory -Force -Path src/python/core/models
New-Item -ItemType Directory -Force -Path src/python/core/toolkits
New-Item -ItemType Directory -Force -Path src/python/core/tools

# Function to safely move files if they exist
function Move-IfExists {
    param($source, $destination)
    if (Test-Path $source) {
        Move-Item -Path $source -Destination $destination -Force
    }
}

# Move files
Move-IfExists src/__init__.py src/python/core/
Move-IfExists src/ai/quantization.py src/python/core/ai/
Move-IfExists src/compliance/__init__.py src/python/core/compliance/
Move-IfExists src/compliance/audit.py src/python/core/compliance/
Move-IfExists src/core/__init__.py src/python/core/
Move-IfExists src/core/agent.py src/python/core/
Move-IfExists src/core/config.py src/python/core/
Move-IfExists src/core/governor.py src/python/core/
Move-IfExists src/core/rules.py src/python/core/
Move-IfExists src/core/tests/test_agent.py src/python/tests/
Move-IfExists src/models/__init__.py src/python/core/models/
Move-IfExists src/models/model_quantizer.py src/python/core/models/
Move-IfExists src/toolkits/__init__.py src/python/core/toolkits/
Move-IfExists src/tools/safety_wrapper.py src/python/core/tools/

Write-Host "Python files moved successfully"