# AWS MSK Demo

*   Create a VPC with subnets
*   Creates a Kafka cluster with one broker in each subnet
*   Creates an EC2 instance that can connect to the Kafka cluster

The CDK stack itself makes uses of two environment variables

*   CDK_DEFAULT_REGION
*   CDK_DEFAULT_ACCOUNT

Those should be set on the command line before executing `cdk deploy`.

# Kafka Client setup

We connect to the Kafka cluster from an EC2 instance running in one of the used
subnets. Before being able to create topics and send messages some basic steps
are required.

## Installing Java

```shell
sudo su -
yum install -y java
```

## Installing Kafka client

```shell
wget https://archive.apache.org/dist/kafka/1.1.1/kafka_2.12-1.1.1.tgz
tar xzf kafka_2.12-1.1.1.tgz
```

## Create Kafka topic

```shell
cd kafka_2.12-1.1.1/bin/
./kafka-topics.sh --zookeeper 172.31.45.65:2181,172.31.20.176:2181,172.31.11.234:2181  --create --topic test --replication-factor 3 --partitions 3
Created topic "test"
```

## Start a producer

```shell
cd kafka_2.12-1.1.1/bin/
echo "Hello Kafka" |  ./kafka-console-producer.sh --topic test --broker-list  b-1.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092, b-2.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092,b-3.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092
```

## Start a consumer

```shell
cd kafka_2.12-1.1.1/bin/
./kafka-console-consumer.sh --topic test --bootstrap-server b-1.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092, b-2.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092,b-3.democluster.dwg2b7.c3.kafka.eu-central-1.amazs.com:9092 --from-beginning
Hello Kafka

```

## Performance testing

```shell
cd kafka_2.12-1.1.1/bin/
./kafka-producer-perf-test.sh --topic test --throughput 100000 --num-records 10000000000 --producer-props acks=all linger.ms=10 batch.size=65536  bootstrap.servers=b-1.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092,b-2.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092,b-3.democluster.dwg2b7.c3.kafka.eu-central-1.amazonaws.com:9092 --record-size 1000
```
