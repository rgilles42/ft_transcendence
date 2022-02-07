# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/07 21:46:35 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:16-alpine as build-stage
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init
RUN apk update --no-cache && apk upgrade --no-cache

WORKDIR /root/

# VueJS Setup
COPY ./app/ app/
WORKDIR /root/app/
RUN npm install
RUN npm install --production

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
