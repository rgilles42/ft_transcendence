# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/12 19:51:56 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:16-alpine as build-stage
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init
RUN apk update --no-cache && apk upgrade --no-cache

WORKDIR /home/node

# VueJS Setup
COPY ./app/ app/
WORKDIR /home/node/app/
RUN npm install
RUN npm run build

FROM nginx:alpine as production-stage
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init
RUN apk update --no-cache && apk upgrade --no-cache
RUN apk add openssl --no-cache

WORKDIR /root/

# NGINX Config

COPY --from=build-stage /home/node/app/dist /var/www/frontend
COPY ./config/nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/ssl/private/
RUN mkdir -p /etc/ssl/certs/
RUN openssl req -newkey rsa:4096 -x509 -days 365 -nodes -keyout /etc/ssl/private/key.pem -out /etc/ssl/certs/cert.pem -subj "/C=FR/ST=Paris/L=Paris/O=42Paris/OU=School/CN=localhost"
