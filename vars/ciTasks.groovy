def install(String cachePath) {
    bat 'npm install --cache "' + cachePath + '" --prefer-offline --no-audit --no-fund'
}
def run(String command, String cachePath) {
    install(cachePath)
    bat command
}
def notifyTelegram(String status) {
    withCredentials([
        string(credentialsId: 'telegram-bot-token', variable: 'TG_TOKEN'),
        string(credentialsId: 'telegram-chat-id', variable: 'TG_CHAT_ID')
    ]) {
        withEnv(['BUILD_STATUS=' + status]) {
            powershell '''
                $mensaje = "TaskFlow - $env:BUILD_STATUS | $env:JOB_NAME #$env:BUILD_NUMBER"
                $uri = "https://api.telegram.org/bot$env:TG_TOKEN/sendMessage"
                Invoke-RestMethod -Method Post -Uri $uri -Body @{
                    chat_id = $env:TG_CHAT_ID
                    text = $mensaje
                } | Out-Null
            '''
        }
    }
}
