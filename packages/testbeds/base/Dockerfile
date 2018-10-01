FROM node:8

LABEL authors="David Enke <post@davidenke.de>"

ADD prepare_testbed.sh /bin/prepare_testbed.sh

RUN chmod a+x /bin/prepare_testbed.sh

RUN mkdir -p /testbed

WORKDIR /testbed

