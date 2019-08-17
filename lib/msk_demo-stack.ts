import cdk = require("@aws-cdk/core");

import { Vpc, SubnetType, Subnet } from "@aws-cdk/aws-ec2";
import { CfnCluster } from "@aws-cdk/aws-msk";

export class MskDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "AWSKafkaTutorialVPC", {
      cidr: "10.0.0.0/16",
      maxAzs: 3,
      subnetConfiguration: []
    });

    const s1 = new Subnet(this, "Subnet-1", {
      vpcId: vpc.vpcId,
      availabilityZone: "eu-west-1a",
      cidrBlock: "10.0.4.0/24"
    });

    const s2 = new Subnet(this, "Subnet-2", {
      vpcId: vpc.vpcId,
      availabilityZone: "eu-west-1b",
      cidrBlock: "10.0.2.0/24"
    });
    const s3 = new Subnet(this, "Subnet-3", {
      vpcId: vpc.vpcId,
      availabilityZone: "eu-west-1c",
      cidrBlock: "10.0.3.0/24"
    });
    vpc.publicSubnets.push(s1);
    vpc.publicSubnets.push(s2);
    vpc.publicSubnets.push(s3);
    /** 
    new CfnCluster(this, "mskCluster", {
      clusterName: "DemoCluster",
      kafkaVersion: "1.1.1",

      numberOfBrokerNodes: 3,
      brokerNodeGroupInfo: {
        clientSubnets: [
          vpc.publicSubnets[0].subnetId,
          vpc.publicSubnets[1].subnetId,
          vpc.publicSubnets[2].subnetId,
          
        ],

        brokerAzDistribution: "DEFAULT",
        instanceType: "kafka.m5.large",
        storageInfo: {
          ebsStorageInfo: {
            volumeSize: 100
          }
        }
      }
    });
   */
  }
}
