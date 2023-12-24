#!/bin/bash
docker-compose up -d --scale mongodb-primary=1 --scale mongodb-secondary=1 