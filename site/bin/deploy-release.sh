#!/bin/bash -e
gatsby build
aws s3 sync public/ s3://salon94design.com/
