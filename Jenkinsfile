//def xgs

pipeline {
    agent any
    environment {
        BUILD_VERSION = VersionNumber (versionNumberString: '${BUILD_YEAR}.${BUILD_MONTH}.${BUILDS_THIS_MONTH}')
        DOCKERH_REPO = "juronja"
        NEXUS_REPO = "192.168.84.20:8082"
        ECR_REPO = "233207430299.dkr.ecr.eu-central-1.amazonaws.com"
        IMAGE_NAME = "utm-builder"
        PROJECT_NAME = "utm-builder"
        IMAGE_TAG_DEV = "dev-latest"
    }
    options { buildDiscarder(logRotator(numToKeepStr: '10')) } // keeping only n builds
    stages {
//        stage('Innit ext script') {
//            steps {
//                script {
//                    xgs = load 'jenkins.groovy'
//                }
//            }
//        }
        stage('Build DEV image for Nexus') {
            environment {
                NEXUS_CREDS = credentials('nexus-creds')
            }
            when {
                branch "dev"
            }
            steps {
                echo "Building DEV Docker image for Nexus ..."
                sh "docker build -t $NEXUS_REPO/$IMAGE_NAME:$IMAGE_TAG_DEV ."
                // Next line in single quotes for security
                sh 'echo $NEXUS_CREDS_PSW | docker login -u $NEXUS_CREDS_USR --password-stdin $NEXUS_REPO'
                sh "docker push $NEXUS_REPO/$IMAGE_NAME:$IMAGE_TAG_DEV"
            }
        }
        stage('Build DEV image for ECR') {
            environment {
                ECR_CREDS = credentials('ecr-creds')
            }
            when {
                branch "dev"
            }
            steps {
                echo "Building DEV Docker image for ECR ..."
                sh "docker build -t $ECR_REPO/$IMAGE_NAME:$IMAGE_TAG_DEV ."
                // Next line in single quotes for security
                sh 'echo $ECR_CREDS_PSW | docker login -u $ECR_CREDS_USR --password-stdin $ECR_REPO'
                sh "docker push $ECR_REPO/$IMAGE_NAME:$IMAGE_TAG_DEV"
            }
        }
        // stage('Unit tests') {
        //     when {
        //         branch "main" 
        //     }
        //     steps {
        //         script {
        //             echo "Unit testing $PROJECT_NAME ..."
        //         }
        //     }
        // }

        stage('Deploy DEV on HOMELAB (Host)') {
            environment {
                MONGO_CREDS = credentials('creds-mongo-utm-builder') // fetches a set of credentials based on the identifier
                MONGO_ADMIN_USER = "$MONGO_CREDS_USR" // uses above creds. essential for bringing the variables to jenkins container
                MONGO_ADMIN_PASS = "$MONGO_CREDS_PSW" // uses above creds. essential for bringing the variables to jenkins container
            }
            when {
                branch "dev" 
            }
            steps {
                script {
                    sh "docker image prune --all --force"
                    // sh "printenv"
                    sh "curl -o compose.base.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/main/compose.base.yaml > compose.base.yaml"
                    sh "curl -o compose.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/main/compose.dev.yaml > compose.yaml"
                    echo "Starting container $PROJECT_NAME ..."
                    sh "docker compose up -d --remove-orphans"
                }
            }
        }
        stage('Deploy DEV on DOKS') {
            environment {
                K8S_NAMESPACE = "utm-builder"
                APP_IMAGE = "$NEXUS_REPO/$IMAGE_NAME:$IMAGE_TAG_DEV"
                HELM_FOLDER = "helm-chart"
            }
            when {
                branch "dev" 
            }
            input {
                message 'Deploy on DOKS?'
            }
            steps {
                script {
                    echo "Deploying helm on DOKS ..."
                    sh "envsubst < $HELM_FOLDER/values.yaml | helm upgrade $PROJECT_NAME $HELM_FOLDER -n $K8S_NAMESPACE --install -f -"
                }
            }
        }
        stage('Build & Deploy PROD') {
            environment {
                DOCKERHUB_CREDS = credentials('dockerhub-creds')
                HOSTING_CREDS = credentials('creds-hosting-prod')
            }
            when {
                branch "main" 
            }
            input {
                message 'Deploy on Production?'
            }
            steps {
                // Build
                echo "Building Docker image for Docker Hub ..."
                sh "docker build -t $DOCKERH_REPO/$IMAGE_NAME:latest -t $DOCKERH_REPO/$IMAGE_NAME:$BUILD_VERSION ."
                // Next line in single quotes for security
                sh 'echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin'
                sh "docker push $DOCKERH_REPO/$IMAGE_NAME:latest"
                sh "docker push $DOCKERH_REPO/$IMAGE_NAME:$BUILD_VERSION"
                // Deploy
                script {
                    sshagent(['ssh-hosting-prod']) {
                        echo "Deploying Docker container on HOSTING-PROD ..."
                        sh "ssh -o StrictHostKeyChecking=no $HOSTING_CREDS_USR@$HOSTING_CREDS_PSW 'bash -c \"\$(wget -qLO - https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/main/compose-commands.sh)\"'"
                    }
                }
            }
        }
        // stage('Deploy PROD on HOSTING-PROD') {
        //     environment {
        //         HOSTING_CREDS = credentials('creds-hosting-prod')
        //     }
        //     when {
        //         branch "main" 
        //     }
        //     steps {
        //         script {
        //             sshagent(['ssh-hosting-prod']) {
        //                 echo "Deploying Docker container on HOSTING-PROD ..."
        //                 sh "ssh -o StrictHostKeyChecking=no $HOSTING_CREDS_USR@$HOSTING_CREDS_PSW 'bash -c \"\$(wget -qLO - https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/main/compose-commands.sh)\"'"
        //             }
        //         }
        //     }
        // }
        // stage('Deploy PROD on EC2') {
        //     when {
        //         branch "main" 
        //     }
        //     steps {
        //         script {
        //             sshagent(['ssh-aws']) {
        //                 echo "Deploying Docker container on EC2  ..."
        //                 sh "ssh -o StrictHostKeyChecking=no ec2-user@18.185.139.225 'bash -c \"\$(wget -qLO - https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/main/compose-e2c-commands.sh)\"'"
        //             }
        //         }
        //     }
        // }
    }
}