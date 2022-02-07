# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/09/07 16:57:22 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/07 19:52:27 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM postgres:14.1-alpine
USER root

ARG POSTGRES_USER=XXXX
ENV POSTGRES_USER $POSTGRES_USER

ARG POSTGRES_PASSWORD=XXXX
ENV POSTGRES_PASSWORD $POSTGRES_PASSWORD

# Init
RUN apk update --no-cache && apk upgrade --no-cache

USER postgres

# Redirect port
EXPOSE 5432

# Start
# ENTRYPOINT ["postgres"]
