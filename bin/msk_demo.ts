#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { MskDemoStack } from '../lib/msk_demo-stack';

const app = new cdk.App();
new MskDemoStack(app, 'MskDemoStack', {
    env: {        
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    }
});
