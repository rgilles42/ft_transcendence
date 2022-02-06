# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/12/02 14:50:00 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/06 17:37:31 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM debian:buster
USER root

ARG DOMAIN_NAME=XXXX
ENV DOMAIN_NAME $DOMAIN_NAME

# Init
RUN apt-get -y update && apt-get -y upgrade

# Packages Installation
RUN	apt-get install -y nodejs npm

# Clean
RUN apt-get -y clean

WORKDIR /root/

# NestJS Setup
COPY ./tools/nestjs_setup.sh ./tools/
RUN bash ./tools/nestjs_setup.sh

# Redirect port
EXPOSE 3000

# Start
ENTRYPOINT ["/bin/bash"]
