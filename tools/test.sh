#!/bin/bash

export TEMP_NG_CONF=.angular-cli.json
export TEMP_DIR=.temp
export TEST_SCOPE=@ngx-material-keyboard
export TEST_NAME=ngx-test

export TEST_ANGULAR_VERSION=$1
export TEST_ANGULAR_CLI_VERSION=$2

echo "TEST_ANGULAR_VERSION: ${TEST_ANGULAR_VERSION}"
echo "TEST_ANGULAR_CLI_VERSION: ${TEST_ANGULAR_CLI_VERSION}"

$(dirname "$0")/prepare-test-bed.sh
$(dirname "$0")/configure-tests.sh
