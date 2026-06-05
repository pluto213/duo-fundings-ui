pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-2'
        AWS_ACCOUNT_ID = '127348475166'
        ECR_REPO = 'duo-fundings-ui'
        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Get Git SHA') {
            steps {
                script {
                    env.GIT_SHA = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()

                    echo "Git SHA: ${env.GIT_SHA}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${ECR_REPO}:${GIT_SHA} .
                """
            }
        }

        stage('Login ECR') {
            steps {
                sh """
                export AWS_PAGER=""
                aws ecr get-login-password --region ${AWS_REGION} \
                | docker login --username AWS --password-stdin ${ECR_URI}
                """
            }
        }

        stage('Tag Images') {
            steps {
                sh """
                # commit version tag (immutable)
                docker tag ${ECR_REPO}:${GIT_SHA} ${ECR_URI}:${GIT_SHA}

                # floating tag for test environment
                docker tag ${ECR_REPO}:${GIT_SHA} ${ECR_URI}:test
                """
            }
        }

        stage('Push to ECR') {
            steps {
                sh """
                docker push ${ECR_URI}:${GIT_SHA}
                docker push ${ECR_URI}:test
                """
            }
        }
    }

    post {
        success {
            echo "✅ Build & Push Success: ${ECR_URI}:${GIT_SHA}"
        }

        failure {
            echo "❌ Pipeline Failed"
        }
    }
}