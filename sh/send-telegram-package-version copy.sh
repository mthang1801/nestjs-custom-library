#!/bin/bash

TOKEN="6203189889:AAGGhFcKjs7bjYJvEMW2c4RJnpKYg56gTA8"
CHAT_ID="-925475547"
versionValue=""
key="version"
re="\"($key)\": \"([^\"]*)\""

while read -r l; do
    if [[ $l =~ $re ]]; then
        name="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        versionValue="$value"
    fi
done < package.json
echo $versionValue

MESSAGE="https://cms.dniinvest.com/ đã cập nhật phiên bản $versionValue"

echo $MESSAGE

curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d text="$MESSAGE" > /dev/null