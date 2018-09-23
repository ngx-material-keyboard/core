#!/bin/bash

# Rename Angular CLI config temporarily
echo "> Rename Angular CLI config temporarily into ${TEMP_NG_CONF}.tmp"
mv ${TEMP_NG_CONF} ${TEMP_NG_CONF}.tmp

# Restore Angular CLI config on abort or finish
finish() {
  echo -e "\n> Restore Angular CLI config to ${TEMP_NG_CONF}"
  mv ${TEMP_NG_CONF}.tmp ${TEMP_NG_CONF}
}
trap 'finish 2> /dev/null' TERM INT EXIT

# Create environment and enter it
echo "> Create Angular ${TEST_ANGULAR_VERSION} test bed in ${TEMP_DIR}/${TEST_ANGULAR_VERSION}"
mkdir -p ${TEMP_DIR}/${TEST_ANGULAR_VERSION} && cd "$_"

# Initialize and install CLI
echo "> Install Angular CLI ${TEST_ANGULAR_CLI_VERSION}"
npm init \
  --scope ${TEST_SCOPE} \
  --yes
npm install @angular/cli@${TEST_ANGULAR_CLI_VERSION} \
  --no-save \
  --no-audit \
  --no-optional \
  --no-package-lock \
  --no-progress \
  --loglevel=error

echo "> (Re)Initialize new project"
rm -rf ${TEST_NAME}
node_modules/.bin/ng new ${TEST_NAME} \
  --force \
  --skip-git \
  --skip-install

echo "> Installed Angular $(npm list @angular/core | sed -En 's/^.*@angular\/core@(.*)$/\1/p')"
cd ${TEST_NAME} && npm install \
  --no-audit \
  --no-optional \
  --no-package-lock \
  --no-progress \
  --loglevel=error

# Leave environment
cd ../../../
