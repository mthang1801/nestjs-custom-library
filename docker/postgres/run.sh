#!/bin/bash
docker-compose up -d --scale postgresql-master=1 --scale postgresql-slave=2
