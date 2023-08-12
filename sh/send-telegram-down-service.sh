#!/bin/bash

TOKEN="6203189889:AAGGhFcKjs7bjYJvEMW2c4RJnpKYg56gTA8"
CHAT_ID="-925475547"
MESSAGE="https://cms.dniinvest.com/ đang tạm dừng để bảo trì và nâng cấp hệ thống"
curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d text="$MESSAGE" > /dev/null