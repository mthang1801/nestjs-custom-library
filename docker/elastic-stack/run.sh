#!/bin/bash
docker-compose up -d --scale es01=1 --scale es02=1 --scale es03=0
docker ps 