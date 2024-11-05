//def xgs

pipeline {
    agent any
    environment {
        BUILD_VERSION = VersionNumber (versionNumberString: '${BUILD_YEAR}.${BUILD_MONTH}.${BUILDS_THIS_MONTH}')
        DOCKERH_REPO = "juronja"
        NEXUS_REPO = "192.168.84.16:8082"
        IMAGE_TAG = "utm-builder"
        CONTAINER_NAME = "utm-builder"
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
        stage('Build STAGE image for Nexus') {
            environment {
                NEXUS_CREDS = credentials('nexus-creds')
            }
            when {
                branch "main" 
            }
            steps {
                echo "Building DEV Docker image for Nexus ..."
                sh "docker build -t $NEXUS_REPO/$IMAGE_TAG:latest ."
                // Next line in single quotes for security
                sh 'echo $NEXUS_CREDS_PSW | docker login -u $NEXUS_CREDS_USR --password-stdin $NEXUS_REPO'
                sh "docker push $NEXUS_REPO/$IMAGE_TAG:latest"
            }
        }
        // stage('Unit tests') {
        //     when {
        //         branch "main" 
        //     }
        //     steps {
        //         script {
        //             echo "Unit testing $CONTAINER_NAME ..."
        //         }
        //     }
        // }
        stage('Deploy STAGE on HOMELAB (Host)') {
            environment {
                MONGO_CREDS = credentials('creds-mongo-utm-builder') // essential for bringing the variables to jenkins container
                MONGO_ADMIN_USER = "$MONGO_CREDS_USR" // essential for bringing the variables to jenkins container
                MONGO_ADMIN_PASS = "$MONGO_CREDS_PSW" // essential for bringing the variables to jenkins container
            }
            when {
                branch "main" 
            }
            steps {
                script {
                    sh "docker image prune --all --force"
                    // sh "printenv"
                    sh "curl -o compose.base.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/main/compose.base.yaml > compose.base.yaml"
                    sh "curl -o compose.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/main/compose.dev.yaml > compose.yaml"
                    echo "Starting container $CONTAINER_NAME ..."
                    sh "docker compose up -d --remove-orphans"
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
                sh "docker build -t $DOCKERH_REPO/$IMAGE_TAG:latest -t $DOCKERH_REPO/$IMAGE_TAG:$BUILD_VERSION ."
                // Next line in single quotes for security
                sh 'echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin'
                sh "docker push $DOCKERH_REPO/$IMAGE_TAG:latest"
                sh "docker push $DOCKERH_REPO/$IMAGE_TAG:$BUILD_VERSION"
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