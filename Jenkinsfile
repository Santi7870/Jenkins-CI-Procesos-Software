pipeline {
    agent any

    tools {
        maven 'Maven3'
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('1 - Repositorio privado') {
            steps {
                checkout scm
                script {
                    def rama = (env.GIT_BRANCH ?: 'main').replaceFirst(/^origin\//, '')
                    env.RUN_EXTENDED = (rama == 'main') ? 'true' : 'false'
                    echo "Rama: ${rama}"
                }
            }
        }

        stage('2 - Compilacion y tests') {
            parallel {
                stage('Pruebas principales') {
                    steps {
                        dir('principal') {
                            checkout scm
                            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                                powershell '-NoProfile -ExecutionPolicy Bypass -File scripts/run-tests.ps1 -Suite CalculadoraTest'
                            }
                        }
                    }
                }
                stage('Pruebas adicionales') {
                    when {
                        expression { env.RUN_EXTENDED == 'true' }
                    }
                    steps {
                        dir('adicional') {
                            checkout scm
                            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                                powershell '-NoProfile -ExecutionPolicy Bypass -File scripts/run-tests.ps1 -Suite CasosAdicionalesTest'
                            }
                        }
                    }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                }
            }
        }

        stage('3 - Notificacion Telegram') {
            steps {
                script {
                    env.BUILD_STATUS = currentBuild.currentResult
                }
                withCredentials([
                    string(credentialsId: 'telegram-bot-token', variable: 'TG_TOKEN'),
                    string(credentialsId: 'telegram-chat-id', variable: 'TG_CHAT_ID')
                ]) {
                    powershell '-NoProfile -ExecutionPolicy Bypass -File scripts/send-telegram.ps1'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline finalizado correctamente.'
        }
        failure {
            echo 'Revisar el registro y los resultados de las pruebas.'
        }
    }
}
