import cdk = require("@aws-cdk/core");

import { Vpc, SubnetType, Subnet, CfnInstance } from "@aws-cdk/aws-ec2";
import { CfnCluster } from "@aws-cdk/aws-msk";
import { KafkaVersion } from "./kafka_version";

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

      kafkaVersion: KafkaVersion.VERSION_2_3_1,
      encryptionInfo: {
        encryptionInTransit: {
          clientBroker: "PLAINTEXT"
        }
      },
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
  }
}
