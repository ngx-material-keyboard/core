FROM ngxmaterialkeyboard/testbeds:base

LABEL authors="David Enke <post@davidenke.de>"

WORKDIR /testbed

COPY ../../core /testbed/

RUN /bin/prepare_testbed.sh

RUN npm install \
    --no-audit \
    --no-optional \
    --no-package-lock \
    --no-progress \
    --loglevel=error

VOLUME /testbed
