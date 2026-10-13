pipeline {
    agent any

    tools {
        // Configurar Maven3 en Manage Jenkins > Tools.
        maven 'Maven3'
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    stages {
        stage('1 - Repositorio privado') {
            steps {
                // Usa el repositorio y las credenciales del trabajo Jenkins.
                checkout scm
            }
        }

        stage('2 - Compilacion y tests') {
            steps {
                // Permite pasar a la notificacion aunque fallen las pruebas.
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat 'mvn -B clean test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('3 - Notificacion Telegram') {
            steps {
                script { env.BUILD_STATUS = currentBuild.currentResult }
                withCredentials([
                    string(credentialsId: 'telegram-bot-token', variable: 'TG_TOKEN'),
                    string(credentialsId: 'telegram-chat-id', variable: 'TG_CHAT_ID')
                ]) {
                    // No muestra las credenciales en los logs.
                    powershell '''
                        $estado = $env:BUILD_STATUS
                        if (-not $estado) { $estado = "DESCONOCIDO" }
                        $mensaje = "Jenkins CI - $estado | $env:JOB_NAME #$env:BUILD_NUMBER"
                        $uri = "https://api.telegram.org/bot$env:TG_TOKEN/sendMessage"
                        Invoke-RestMethod -Method Post -Uri $uri -Body @{
                            chat_id = $env:TG_CHAT_ID
                            text = $mensaje
                        } | Out-Null
                    '''
                }
            }
        }
    }

    post {
        success { echo 'Pipeline finalizado correctamente.' }
        failure { echo 'Revisar el log y los resultados de las pruebas.' }
    }
}
