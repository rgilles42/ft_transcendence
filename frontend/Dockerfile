# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/07 18:57:35 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:16-buster
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init
RUN apt-get -y update && apt-get -y upgrade

# Clean
RUN apt-get -y clean

WORKDIR /root/

# NestJS Setup
COPY ./app/ app/
WORKDIR /root/app/
RUN npm install

# Redirect port
EXPOSE 8080

# Start
ENTRYPOINT ["npm", "run", "serve"]
