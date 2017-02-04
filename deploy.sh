#!/bin/bash
# usage: ./deploy.sh staging f0478bd7c2f584b41a49405c91a439ce9d944657
BRANCH=$1
SHA1=$2

# Replace with your variables
AWS_ACCOUNT_ID=12345678900
NAME=name-of-service-to-deploy
EB_BUCKET=aws-s3-bucket-to-hold-application-versions

VERSION=$BRANCH-$SHA1
ZIP=$VERSION.zip

aws configure set default.region us-east-1

# Login to AWS Elastic Container Registry
eval $(aws ecr get-login)

# Build the image
docker build -t $NAME:$VERSION .
# Tag it
docker tag $NAME:$VERSION $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION
# Push to AWS Elastic Container Registry
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$NAME:$VERSION

# Replace the <AWS_ACCOUNT_ID> with your ID
sed -i='' "s/<AWS_ACCOUNT_ID>/$AWS_ACCOUNT_ID/" Dockerrun.aws.json
# Replace the <NAME> with the your name
sed -i='' "s/<NAME>/$NAME" Dockerrun.aws.json
# Replace the <TAG> with the your version number
sed -i='' "s/<TAG>/$VERSION/" Dockerrun.aws.json

# Zip up the Dockerrun file
zip -r $ZIP Dockerrun.aws.json

# Send zip to S3 Bucket
aws s3 cp $ZIP s3://$EB_BUCKET/$ZIP

# Create a new application version with the zipped up Dockerrun file
aws elasticbeanstalk create-application-version --application-name $NAME-application --version-label $VERSION --source-bundle S3Bucket=$EB_BUCKET,S3Key=$ZIP

# Update the environment to use the new application version
aws elasticbeanstalk update-environment --environment-name Sample-env-1 --version-label $VERSION