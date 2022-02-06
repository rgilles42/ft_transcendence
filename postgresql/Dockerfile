# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/09/07 16:57:22 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/06 17:11:22 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM debian:buster
USER root

ARG POSTGRES_ROOT_PASSWORD=XXXX
ENV POSTGRES_ROOT_PASSWORD $POSTGRES_ROOT_PASSWORD

ARG POSTGRES_USER=XXXX
ENV POSTGRES_USER $POSTGRES_USER

ARG POSTGRES_PASSWORD=XXXX
ENV POSTGRES_PASSWORD $POSTGRES_PASSWORD

ARG POSTGRES_VERSION=11
ENV POSTGRES_VERSION $POSTGRES_VERSION

# Init
RUN apt-get -y update && apt-get -y upgrade

# Packages Installation
RUN	apt-get -y install postgresql-${POSTGRESQL_VERSION} postgresql-client-${POSTGRESQL_VERSION} postgresql-contrib-${POSTGRESQL_VERSION}

# Clean
RUN apt-get -y clean

WORKDIR /root/

# PostgreSQL Setup
COPY ./tools/postgresql_setup.sh ./tools/
RUN bash ./tools/postgresql_setup.sh

WORKDIR /usr/lib/postgresql/${POSTGRESQL_VERSION}/bin

# Redirect port
EXPOSE 5432

# Start
ENTRYPOINT [ "./postgres", "-D", "/etc/postgresql/${POSTGRESQL_VERSION}/main/" ]
