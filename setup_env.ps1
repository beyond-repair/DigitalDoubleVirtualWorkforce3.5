# Check if Python is available in PATH
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Error "Python is not installed or not found in PATH. Please install Python from https://python.org and ensure it is added to your PATH."
    exit 1
}

# Define the virtual environment directory name
$venvDir = "venv"

# Check if the virtual environment already exists; if not, create it
if (-Not (Test-Path -Path $venvDir)) {
    python -m venv $venvDir
    if (-Not (Test-Path -Path $venvDir)) {
        Write-Error "Failed to create virtual environment. Please ensure Python's venv module is available."
        exit 1
    }
}

# Activate the virtual environment
$activateScript = "$venvDir\Scripts\Activate.ps1"
if (-Not (Test-Path -Path $activateScript)) {
    Write-Error "Activation script not found at $activateScript. Virtual environment may be corrupted."
    exit 1
}
& $activateScript

# Upgrade pip to the latest version
python -m pip install --upgrade pip

# Install dependencies from requirements.txt if the file exists
if (Test-Path -Path "requirements.txt") {
    pip install -r requirements.txt
} else {
    Write-Warning "requirements.txt not found. Skipping dependency installation."
}

# Run the local model script if it exists
if (Test-Path -Path "local_model.py") {
    python local_model.py
} else {
    Write-Warning "local_model.py not found. Skipping script execution."
}