#!/bin/bash

TEMP_NG_CONF=.angular-cli.json
TEMP_DIR=.temp
TEST_SCOPE=@ngx-material-keyboard
TEST_NAME=ngx-test

TEST_ANGULAR_VERSION=$1
TEST_ANGULAR_CLI_VERSION=$2

./prepare-test-bed.sh
./configure-tests.sh
