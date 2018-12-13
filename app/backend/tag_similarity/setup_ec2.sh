#!/bin/bash

scp -i "se7en.pem" -o "StrictHostKeyChecking no" ./ec2.sh ubuntu@ec2-3-81-240-210.compute-1.amazonaws.com:~/
scp -i "se7en.pem" -o "StrictHostKeyChecking no" ./query_similarity.cpp ubuntu@ec2-3-81-240-210.compute-1.amazonaws.com:~/
ssh -i "se7en.pem" -o "StrictHostKeyChecking no" ubuntu@ec2-3-81-240-210.compute-1.amazonaws.com "chmod 755 ./ec2.sh && ./ec2.sh"
