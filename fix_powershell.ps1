# Fix PowerShell Execution Policy for npm
Write-Host "🔧 Fixing PowerShell execution policy..." -ForegroundColor Yellow

# Check current policy
$currentPolicy = Get-ExecutionPolicy
Write-Host "Current execution policy: $currentPolicy" -ForegroundColor Cyan

# Set execution policy for current user (if not already set)
if ($currentPolicy -eq "Restricted") {
    Write-Host "Setting execution policy to RemoteSigned for current user..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "✅ Execution policy updated!" -ForegroundColor Green
} else {
    Write-Host "✅ Execution policy is already permissive ($currentPolicy)" -ForegroundColor Green
}

Write-Host ""
Write-Host "You may need to restart your terminal for changes to take effect." -ForegroundColor Yellow
Write-Host "Or run this command manually:" -ForegroundColor Yellow
Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan

