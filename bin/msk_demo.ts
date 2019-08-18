#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { MskDemoStack } from '../lib/msk_demo-stack';

const app = new cdk.App();
new MskDemoStack(app, 'MskDemoStack', {
    env: {
        region: 'eu-west-1',
        account: 'ACCOUNTID'
    }
});
