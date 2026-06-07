pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-2'
        AWS_ACCOUNT_ID = '127348475166'
        ECR_REPO = 'duo-fundings-ui'
        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
        ECS_CLUSTER = 'duo-cluster'
        ECS_SERVICE = 'duo-fundings-ui-task-service'
        ECS_TASK_DEF = 'duo-fundings-ui-task'
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

        stage('Deploy to ECS') {
            steps {
                sh """
                export AWS_PAGER=""

                # 1. 获取当前 task definition 并替换镜像
                aws ecs describe-task-definition \
                    --task-definition ${ECS_TASK_DEF} \
                    --region ${AWS_REGION} \
                    --query 'taskDefinition' \
                    --output json | \
                python3 -c "
import sys, json
data = json.load(sys.stdin)
data['containerDefinitions'][0]['image'] = '${ECR_URI}:${GIT_SHA}'
for key in ['taskDefinitionArn','revision','status','requiresAttributes','compatibilities','registeredAt','registeredBy']:
    data.pop(key, None)
json.dump(data, sys.stdout)
" > new-task-def.json

                # 2. 注册新的 task definition
                NEW_TASK_DEF=\$(aws ecs register-task-definition \
                    --cli-input-json file://new-task-def.json \
                    --region ${AWS_REGION} \
                    --query 'taskDefinition.taskDefinitionArn' \
                    --output text)

                echo "New task definition: \$NEW_TASK_DEF"

                # 3. 更新 ECS 服务
                aws ecs update-service \
                    --cluster ${ECS_CLUSTER} \
                    --service ${ECS_SERVICE} \
                    --task-definition \$NEW_TASK_DEF \
                    --region ${AWS_REGION} \
                    --query 'service.taskDefinition' \
                    --output text

                echo "✅ ECS service updated"

                # 4. 等待部署稳定
                aws ecs wait services-stable \
                    --cluster ${ECS_CLUSTER} \
                    --services ${ECS_SERVICE} \
                    --region ${AWS_REGION}

                echo "✅ ECS deployment stable"
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