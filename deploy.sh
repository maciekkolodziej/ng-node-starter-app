#!/bin/bash

# usage: ./deploy.sh staging f0478bd7c2f584b41a49405c91a439ce9d944657
BRANCH=$1
SHA1=$2

NAME=ng-node-starter-app
EB_BUCKET=ng-node-starter-app-deployments
REGION=us-west-2

echo Deploying $NAME to environment $BRANCH, region: $REGION

ENV=$NAME-$BRANCH
VERSION=$BRANCH-$SHA1
ZIP=$VERSION.zip

aws configure set default.region $REGION
aws configure set default.output json

# Login to AWS Elastic Container Registry
eval $(aws ecr get-login)

# Build the image
docker build -t $NAME:$VERSION .
# Tag it
docker tag $NAME:$VERSION $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$NAME:$VERSION
# Push to AWS Elastic Container Registry
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$NAME:$VERSION

# Replace the <AWS_ACCOUNT_ID> with your ID
sed -i='' "s/<AWS_ACCOUNT_ID>/$AWS_ACCOUNT_ID/" dockerrun.aws.json
# Replace the <NAME> with the your name
sed -i='' "s/<NAME>/$NAME" dockerrun.aws.json
# Replace the <TAG> with the your version number
sed -i='' "s/<TAG>/$VERSION/" dockerrun.aws.json

# Zip up the Dockerrun file
zip -r $ZIP dockerrun.aws.json

# Send zip to S3 Bucket
aws s3 cp $ZIP s3://$EB_BUCKET/$ZIP

# Create a new application version with the zipped up Dockerrun file
aws elasticbeanstalk create-application-version --application-name $NAME --version-label $VERSION --source-bundle S3Bucket=$EB_BUCKET,S3Key=$ZIP

# Update the environment to use the new application version
aws elasticbeanstalk update-environment --environment-name $ENV --version-label $VERSION
