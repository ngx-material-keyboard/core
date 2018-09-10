#!/bin/bash

TEMP_NG_CONF=.angular-cli.json
TEMP_DIR=.temp
TEST_SCOPE=@ngx-material-keyboard
TEST_NAME=ngx-test
TEST_CONFIG=testbeds.json
TESTS=($(sed -n 's/"\(.*\)":\s*"\(.*\)",*/\1 \2/p' ${TEST_CONFIG}))

# Rename Angular CLI config temporarily
echo "> Rename Angular CLI config temporarily into ${TEMP_NG_CONF}.tmp"
mv ${TEMP_NG_CONF} ${TEMP_NG_CONF}.tmp

# Restore Angular CLI config on EXIT
function finish {
  echo -e "\n> Restore Angular CLI config to ${TEMP_NG_CONF}"
  mv ${TEMP_NG_CONF}.tmp ${TEMP_NG_CONF}
}
trap finish EXIT

# Recreate test folder and change into it
echo "> Recreate test folders in ${TEMP_DIR}"
rm -rf ${TEMP_DIR}
mkdir -p ${TEMP_DIR}
cd ${TEMP_DIR}

# Read tests from config file
for i in "${!TESTS[@]}"; do
  if [[ $(( i % 2 )) == 1 ]]; then
    echo -e "\n"
    _ANGULAR_VERSION=${TESTS[$i-1]}
    _ANGULAR_CLI_VERSION=${TESTS[$i]}

    echo "> Create Angular ${_ANGULAR_VERSION} test bed in ${TEMP_DIR}/${_ANGULAR_VERSION}"
    mkdir -p ${_ANGULAR_VERSION}
    cd ${_ANGULAR_VERSION}

    echo "> Install Angular CLI ${_ANGULAR_CLI_VERSION}"
    npm init test-ng${_ANGULAR_VERSION} \
      --scope ${TEST_SCOPE} \
      --yes \
      &>/dev/null
    npm install @angular/cli@${_ANGULAR_CLI_VERSION} \
      --no-save \
      --no-audit \
      --no-optional \
      --no-package-lock \
      --no-progress \
      --loglevel=error \
      &>/dev/null

    echo "> Initialize new project"
    node_modules/.bin/ng new ${TEST_NAME} \
      --force \
      --skip-tests \
      --skip-git \
      --skip-install \
      &>/dev/null

    echo "> Installed Angular $(node_modules/.bin/ng --version | sed -En 's/Angular: (.*)/\1/p')"
    cd ..;
  fi
done

# Leave test folder
cd ..
