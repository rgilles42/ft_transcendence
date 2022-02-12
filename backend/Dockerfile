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

# NestJS Setup
COPY ./app/ app/
WORKDIR /home/node/app/
RUN npm install

# Redirect port
EXPOSE 3000

# Start
ENTRYPOINT ["npm", "run", "start:prod"]
