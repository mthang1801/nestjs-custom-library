#!/bin/bash
TOKEN=6203189889:AAGGhFcKjs7bjYJvEMW2c4RJnpKYg56gTA8
CHAT_ID=-925475547

function getPackageInfoByKey {
  key=$1
  re="\"($key)\": \"([^\"]*)\""
  response=""
  while read -r l; do
    if [[ $l =~ $re ]]; then
        name="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        response="$value"
    fi
  done < package.json
  echo $response
}

VERSION=$(getPackageInfoByKey "version")
DESCRIPTION=$(echo $(getPackageInfoByKey "description") | sed "s/\\\n/%0A/g")

COMMIT=$(bash commit-message.sh)
MESSAGE="""
<a href='https://cms-api.dniinvest.com/'>CMS API</a>has been released version $VERSION
Last commit from git repository: <b>$COMMIT</b>
Update version information: %0A -$DESCRIPTION
"""

curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d parse_mode=html -d chat_id=$CHAT_ID -d text="$MESSAGE"