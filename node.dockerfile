FROM buildpack-deps:stretch as mkcert
ARG MKCERT_VERSION=v1.4.3

RUN apt update && apt-get install -y libnss3-tools
RUN wget https://github.com/FiloSottile/mkcert/releases/download/${MKCERT_VERSION}/mkcert-${MKCERT_VERSION}-linux-amd64 -O mkcert && \
    chmod +x mkcert && \
    mv mkcert /usr/local/bin && \
    mkcert -install && \
    mkcert localhost 127.0.0.1 ::1

FROM node:14
COPY --from=mkcert /localhost*.pem /

RUN useradd -ms /bin/bash nodejs && mkdir /app
USER nodejs
WORKDIR /app
