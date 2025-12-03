$ErrorActionPreference = 'Stop'

function Wait-ForBackend {
  param([int]$TimeoutSec = 30)
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  do {
    try {
      Invoke-WebRequest -Uri 'http://localhost:8080/api/hello' -UseBasicParsing -TimeoutSec 2 | Out-Null
      Write-Output 'BACKEND_UP'
      return
    } catch {
      Start-Sleep -Seconds 1
    }
  } while ((Get-Date) -lt $deadline)
  throw 'Backend did not become ready in time.'
}

Wait-ForBackend -TimeoutSec 45

$ts = Get-Date -Format 'yyyyMMddHHmmss'
$email = "smoke+$ts@example.com"
$pass = 'TestPassword123!'

$regBody = @{ email=$email; password=$pass; firstName='Smoke'; lastName='Test' } | ConvertTo-Json
$loginBody = @{ email=$email; password=$pass } | ConvertTo-Json

Write-Output ("REGISTER_EMAIL:" + $email)

try {
  $reg = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/register' -Method Post -Body $regBody -ContentType 'application/json' -TimeoutSec 20
  Write-Output 'REGISTER_OK'
} catch {
  Write-Output 'REGISTER_FAILED'
  Write-Output $_.Exception.Message
  exit 3
}

try {
  $login = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json' -TimeoutSec 20
  Write-Output 'LOGIN_OK'
} catch {
  Write-Output 'LOGIN_FAILED'
  Write-Output $_.Exception.Message
  exit 4
}

$token = $login.token
if (-not $token) { Write-Output 'NO_TOKEN'; exit 4 }
Write-Output ("TOKEN:" + $token)

$hdr = @{ Authorization = 'Bearer ' + $token }
try {
  $orders = Invoke-RestMethod -Uri 'http://localhost:8080/api/orders/user' -Method Get -Headers $hdr -TimeoutSec 20
  Write-Output 'ORDERS_OK'
  $orders | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output 'ORDERS_FAILED'
  Write-Output $_.Exception.Message
  exit 5
}

Write-Output 'SMOKE_OK'
