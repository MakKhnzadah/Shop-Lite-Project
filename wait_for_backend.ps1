$max=60
for ($i=0; $i -lt $max; $i++) {
    try {
        $r = Invoke-RestMethod -Uri 'http://localhost:8080/api/hello' -Method GET -ErrorAction Stop
        Write-Output "READY: $r"
        break
    } catch {
        Write-Output "waiting $i..."
        Start-Sleep -Seconds 1
    }
}
if ($i -ge $max) { Write-Output "TIMEOUT waiting for backend" ; exit 1 }
