pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-2'
        ECR_REPO = 'duo-fundings-ui'
        AWS_ACCOUNT_ID = '127348475166'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build \
                  -t ${ECR_REPO}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Login ECR') {
            steps {
                sh '''
                aws ecr get-login-password \
                  --region ${AWS_REGION} \
                | docker login \
                  --username AWS \
                  --password-stdin \
                  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Push ECR') {
            steps {
                sh '''
                docker tag \
                  ${ECR_REPO}:${IMAGE_TAG} \
                  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

                docker push \
                  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }
    }
}