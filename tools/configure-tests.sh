#!/bin/bash

echo "TEST_ANGULAR_VERSION: ${TEST_ANGULAR_VERSION}"
echo "TEST_ANGULAR_CLI_VERSION: ${TEST_ANGULAR_CLI_VERSION}"

# Enter test environment
cd ${TEMP_DIR}/${TEST_ANGULAR_VERSION}/${TEST_NAME}

echo "> Prepare CI tests"
# Add headless chrome launcher for unit tests
find . -name karma.conf.js -type f -exec sed -i '' -E "s/(browsers:.*,)/\1 \
  customLaunchers: { \
    ChromeHeadlessCI: { \
      base: 'ChromeHeadless', \
      flags: ['--no-sandbox', '--disable-gpu'] \
    } \
  }, \
/g" {} \;
# Add headless chrome launcer for e2e tests
find . -name protractor.conf.js -type f -exec sed -i '' -E "s/('browserName': 'chrome')/\1, \
  chromeOptions: { \
    args: ['--headless', '--no-sandbox', '--disable-gpu'] \
  } \
/g" {} \;

echo "> Link ${TEST_SCOPE}"

echo "> Add tests"

echo "> Run unit and e2e tests"
npm run test -- --watch=false --progress=false --browsers=ChromeHeadlessCI
npm run e2e

# Leave environment
cd ../../../
