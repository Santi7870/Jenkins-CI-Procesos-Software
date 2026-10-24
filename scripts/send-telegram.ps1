$estado = $env:BUILD_STATUS
if (-not $estado) { $estado = 'DESCONOCIDO' }
$mensaje = "Jenkins CI - $estado | $env:JOB_NAME #$env:BUILD_NUMBER"
$uri = "https://api.telegram.org/bot$env:TG_TOKEN/sendMessage"
Invoke-RestMethod -Method Post -Uri $uri -Body @{
    chat_id = $env:TG_CHAT_ID
    text = $mensaje
} | Out-Null
