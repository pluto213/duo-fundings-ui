首次部署（手动）         后续部署（Pipeline 自动）
─────────────           ────────────────────
创建 ALB                git push
创建 ECS 集群            ↓
创建 Task Definition     Jenkins 自动构建镜像
创建 ECS Service         ↓
                        推送新镜像到 ECR
                        ↓
                        注册新 Task Definition
                        ↓
                        ECS 自动滚动更新



Security Groups
ALB 
alb-duo-fundings-ui
ecs-sg-alb-duo-fundings-ui
tg-duo-fundings-ui

ECS Cluster: duo-cluster
ECS Service: duo-fundings-ui-task-service
ECS ALB: alb-duo-fundings-ui
Target Group: tg-duo-fundings-ui

