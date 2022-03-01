# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/12 19:20:54 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:16-alpine
USER root

# Init
RUN apk update --no-cache && apk upgrade --no-cache

WORKDIR /home/node

RUN npm install @nestjs/cli -g

# NestJS Setup
COPY ./app/ app/
WORKDIR /home/node/app/
RUN npm install
RUN npm run build

# Redirect port
EXPOSE 3000

# Start
COPY ./tools/ ./tools/
ENTRYPOINT ["/bin/sh", "tools/entrypoint.sh"]
