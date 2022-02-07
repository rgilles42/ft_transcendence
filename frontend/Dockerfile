# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/07 21:16:57 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:16-alpine as build-stage
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init for node:16-alpine
RUN apk update --no-cache && apk upgrade --no-cache
# Init & Clean for node:16-buster
# RUN apt-get -y update && apt-get -y upgrade && apt-get -y clean

WORKDIR /root/

# VueJS Setup
COPY ./app/ app/
WORKDIR /root/app/
RUN npm install
# RUN npm run build
RUN npm install --production

# Redirect port
# EXPOSE 8080

# Start
# ENTRYPOINT ["npm", "run", "serve"]

FROM nginx:alpine as production-stage
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init
RUN apk update --no-cache && apk upgrade --no-cache

WORKDIR /root/

# NGINX Config

COPY --from=build-stage /root/app/dist /var/www/frontend
COPY ./config/nginx.conf /etc/nginx/nginx.conf
