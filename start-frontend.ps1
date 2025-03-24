# Get the script's directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Navigate to the frontend directory
$frontendPath = Join-Path -Path $scriptPath -ChildPath "src\frontend"

# Check if the path exists
if (Test-Path -Path $frontendPath) {
    # Navigate to the frontend directory
    Set-Location -Path $frontendPath

    # Set the port to avoid conflicts
    $env:PORT = 3001

    # Install react-scripts if needed
    if (-not (Test-Path -Path ".\node_modules\.bin\react-scripts.cmd")) {
        Write-Host "Installing react-scripts..."
        npm install --legacy-peer-deps
    }

    # Start the React application using npx
    npx react-scripts start
} else {
    Write-Error "Frontend directory not found at: $frontendPath"
    exit 1
} 