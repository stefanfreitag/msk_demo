import cdk = require("@aws-cdk/core");

import { Vpc, SubnetType, Subnet, CfnInstance } from "@aws-cdk/aws-ec2";
import { CfnCluster } from "@aws-cdk/aws-msk";

export class MskDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create a separate VPC for the Kafka cluster
    const vpc = new Vpc(this, "AWSKafkaTutorialVPC", {
      cidr: "10.0.0.0/16",
      maxAzs: 3,
      subnetConfiguration: [
        { cidrMask: 24, name: "kafka", subnetType: SubnetType.PUBLIC }
      ]
    });

    // Create the Kafka cluster with one broker per availability zone
    const cluster = new CfnCluster(this, "mskCluster", {
      clusterName: "AWSKafkaTutorialCluster",
      kafkaVersion: "1.1.1",

      numberOfBrokerNodes: 3,
      brokerNodeGroupInfo: {
        clientSubnets: [
          vpc.publicSubnets[0].subnetId,
          vpc.publicSubnets[1].subnetId,
          vpc.publicSubnets[2].subnetId
        ],

        brokerAzDistribution: "DEFAULT",
        instanceType: "kafka.m5.large",
        storageInfo: {
          ebsStorageInfo: {
            volumeSize: 200
          }
        }
      }
    });
    // Create an EC2 instance used to access the Kafka cluster
    /**
    const ec2Instance = new CfnInstance(this, "demo-instance", {
      instanceType: "t3.micro",
      tags: [{ key: "Key", value: "AWSKafkaTutorialClient" }],
      imageId: "ami-0bbc25e23a7640b9b",
      monitoring: false,
      keyName: "sfreitag_key",
      networkInterfaces: [
        {
          deviceIndex: "0",
          associatePublicIpAddress: true,
     //     subnetId: vpc.publicSubnets[0].subnetId
        }
      ]
    });
    //const secGroupId = ec2Instance.securityGroupIds[0];
  */
  }
}
