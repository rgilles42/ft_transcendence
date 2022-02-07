# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/07 21:45:59 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:16-alpine
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init
RUN apk update --no-cache && apk upgrade --no-cache

WORKDIR /root/

# NestJS Setup
COPY ./app/ app/
WORKDIR /root/app/
RUN npm install --production

# Redirect port
EXPOSE 3000

# Start
ENTRYPOINT ["npm", "run", "start:prod"]
