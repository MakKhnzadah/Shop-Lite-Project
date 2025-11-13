try { Invoke-WebRequest -Uri 'http://localhost:8080/api/hello' -UseBasicParsing -TimeoutSec 5; Write-Output 'BACKEND_UP' } catch { Write-Output 'BACKEND_DOWN'; exit 2 }

$ts = Get-Date -Format 'yyyyMMddHHmmss'
$email = 'smoke+' + $ts + '@example.com'
$pass = 'TestPassword123!'
$body = @{ email=$email; password=$pass; firstName='Smoke'; lastName='Test' } | ConvertTo-Json
Write-Output ("REGISTER_EMAIL:" + $email)

try {
  $reg = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/register' -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 20
  Write-Output 'REGISTER_OK'
  $reg | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output 'REGISTER_FAILED'
  Write-Output $_.Exception.Message
  exit 3
}

$loginBody = @{ email=$email; password=$pass } | ConvertTo-Json
try {
  $login = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json' -TimeoutSec 20
  Write-Output 'LOGIN_OK'
  $token = $login.token
  Write-Output ("TOKEN:" + $token)
} catch {
  Write-Output 'LOGIN_FAILED'
  Write-Output $_.Exception.Message
  exit 4
}

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
