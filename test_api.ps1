# Test root endpoint
Write-Host "Testing root endpoint..."
Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method Get

# Create a slice
Write-Host "`nCreating a network slice..."
$sliceBody = @{
    name = 'test-slice'
    qos_requirements = @{
        latency_ms = 20.0
        bandwidth_mbps = 1000.0
        reliability = 99.9
        isolation_level = 'shared'
    }
    service_type = 'eMBB'
} | ConvertTo-Json

$slice = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/slices" -Method Post -Body $sliceBody -ContentType "application/json"
Write-Host "Created slice with ID: $($slice.slice_id)"

# List all slices
Write-Host "`nListing all slices..."
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/slices" -Method Get

# Create a VNF instance
Write-Host "`nCreating a VNF instance..."
$vnfBody = @{
    vnf_type = 'firewall'
    instance_name = 'test-firewall'
    config = @{
        port = '8080'
    }
} | ConvertTo-Json

$vnf = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/vnf/instances" -Method Post -Body $vnfBody -ContentType "application/json"
Write-Host "Created VNF instance with ID: $($vnf.instance_id)"

# List all VNF instances
Write-Host "`nListing all VNF instances..."
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/vnf/instances" -Method Get 