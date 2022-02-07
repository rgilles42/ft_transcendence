# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/07 21:16:48 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:16-alpine
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init for node:16-alpine
RUN apk update --no-cache && apk upgrade --no-cache
# Init & Clean for node:16-buster
# RUN apt-get -y update && apt-get -y upgrade && apt-get -y clean

WORKDIR /root/

# NestJS Setup
COPY ./app/ app/
WORKDIR /root/app/
# RUN npm install
RUN npm install --production

# Redirect port
EXPOSE 3000

# Start
# ENTRYPOINT ["npm", "run", "start:dev"]
ENTRYPOINT ["npm", "run", "start:prod"]
