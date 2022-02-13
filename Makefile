# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ppaglier <ppaglier@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/06/04 16:05:44 by ppaglier          #+#    #+#              #
#    Updated: 2022/02/12 20:07:39 by ppaglier         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #


NAME			=	ft_transcendence

COMPOSE_DIR		=	./
COMPOSE_FILE	=	${COMPOSE_DIR}/docker-compose.yml

COMPOSE_CMD		=	-f ${COMPOSE_FILE}

ENV_FILE		=	${COMPOSE_DIR}/.env

ifneq (,$(wildcard ${ENV_FILE}))
 include ${ENV_FILE}
endif

## Use ${USER} or change LOGIN value
LOGIN			?=	ppaglier

## Default values for .env
COMPOSE_PROJECT_NAME ?=	${NAME}
BONUS				 ?=	false

DOMAIN_NAME		?=	${LOGIN}.42.fr
DOMAIN_TARGET	?=	127.0.0.1

POSTGRES_DB				?=	ft_transcendence
POSTGRES_USER			?=	postgres
POSTGRES_PASSWORD		?=	password123

_END=\e[0m

_GREY=\e[30m
_RED=\e[31m
_GREEN=\e[32m
_YELLOW=\e[33m
_BLUE=\e[34m
_PURPLE=\e[35m
_CYAN=\e[36m
_WHITE=\e[37m

ifeq (${BONUS}, true)
 COMPOSE_CMD	= -f ${COMPOSE_FILE}
endif

help: ## Show all commands of the makefile and helpers
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install all things that the 42 VM has by default
	@echo "${_BLUE}[Install VM..]${_END}"
	@sudo apt-get install zsh vim emacs curl gcc clang-9 lldb llvm valgrind php-cli php-curl php-gd php-intl php-json php-mbstring php-xml php-zip php-mysql php-pgsql g++ as31 nasm ruby ruby-bundler ruby-dev build-essential mysql-server sqlite3 postgresql docker.io qemu-kvm virtualbox virtualbox-qt virtualbox-dkms libx11-dev x11proto-core-dev libxt-dev libxext-dev libbsd-dev terminator nasm freeglut3 libncurses5-dev glmark2 cmake nginx docker-compose python3-pip python-pip redis
	@curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.18.0/bin/linux/amd64/kubectl
	@curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.18.0/bin/linux/amd64/kubectl
	@chmod +x ./kubectl
	@sudo mv ./kubectl /usr/local/bin/kubectl
	@curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
	@chmod +x minikube
	@sudo mkdir -p /usr/local/bin/
	@sudo install minikube /usr/local/bin/
	@sudo usermod -aG docker user42
	@newgrp docker
	@sudo add-apt-repository ppa:/longsleep/golang-backports
	@sudo apt update
	@sudo apt install golang-go
	@wget -qO- https://deb.nodesource.com/setup_13.x | sudo -E bash -
	@sudo apt install -y nodejs
	@curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
	@echo "${_BLUE}[Install VM done!]${_END}"

setup: initEnv fclean initServices initHost ## Setup project (full clean & full init)
	@echo "${_BLUE}[Setup done!]${_END}"

teardown: fclean ## Teardown project (full clean & remove hosts modifcations)
	@if grep "${DOMAIN_TARGET}	${DOMAIN_NAME}" /etc/hosts; then \
		sudo sed -i "/${DOMAIN_TARGET}	${DOMAIN_NAME}/d" /etc/hosts; \
		sudo sed -i "/${DOMAIN_TARGET}	www.${DOMAIN_NAME}/d" /etc/hosts; \
	fi
	@echo "${_BLUE}[Teardown done!]${_END}"

initServices: ## Shutdown default nginx & postgresql for prevent used port error
	@echo "${_BLUE}[Shutdown local services..]${_END}"
	@sudo service postgresql stop
	@sudo service nginx stop
	@echo "${_BLUE}[Shutdown local services done!]${_END}"

initEnv: ## Create the .env and fill default fields (Warning: this will overwrite the current .env)
	@echo "${_BLUE}[Init .env with defaults values..]${_END}"
	@cp ${ENV_FILE}.example ${ENV_FILE}
	@sed -i 's|£PROJECT_NAME|${COMPOSE_PROJECT_NAME}|g' ${ENV_FILE}
	@sed -i 's|£BONUS|${BONUS}|g' ${ENV_FILE}
	@sed -i 's|£DOMAIN_NAME|${DOMAIN_NAME}|g' ${ENV_FILE}
	@sed -i 's|£DOMAIN_TARGET|${DOMAIN_TARGET}|g' ${ENV_FILE}

	@sed -i 's|£POSTGRES_DB|${POSTGRES_DB}|g' ${ENV_FILE}
	@sed -i 's|£POSTGRES_USER|${POSTGRES_USER}|g' ${ENV_FILE}
	@sed -i 's|£POSTGRES_PASSWORD|${POSTGRES_PASSWORD}|g' ${ENV_FILE}

	@echo "${_CYAN}Don't forget to manualy change .env values${_END}"
	@echo "${_BLUE}[Init .env done!]${_END}"

initHost: ## Add domain to host
	@echo "${_BLUE}[Update hosts file..]${_END}"
	@if ! grep -q "${DOMAIN_TARGET}	${DOMAIN_NAME}" '/etc/hosts'; then \
		sudo bash -c 'echo "${DOMAIN_TARGET}	${DOMAIN_NAME}" >> /etc/hosts'; \
		sudo bash -c 'echo "${DOMAIN_TARGET}	www.${DOMAIN_NAME}" >> /etc/hosts'; \
	fi
	@echo "${_CYAN}Don't forget to run 'make teardown' after for removing hosts modifcations${_END}"
	@echo "${_BLUE}[Update hosts file done!]${_END}"

clean: destroy ## Clean docker
	@docker system prune --force

fclean: clean ## Full clean docker & volumes
	@docker system prune --force --all

build: ## Build or rebuild services (only use it to debug, this will not be used in correction)
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} build

up: ## Create and start containers
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} up --build -d

start: ## Start services
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} start

stop: ## Stop services
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} stop

down: ## Stop and remove containers, networks and images
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} down

restart: ## Stop services then Create and start containers
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} stop
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} up -d

destroy: ## Stop and remove containers, networks, images, and volumes
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} down -v

logs: ## View output from containers
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} logs --tail=100 -f

ps: ## List containers
	@docker-compose ${COMPOSE_CMD} --project-directory ${COMPOSE_DIR} ps

.PHONY: help install setup initServices initEnv clean fclean build up start stop restart down destroy logs ps