#!/bin/bash
git log --oneline -1 > commit.txt
current_date_time="`date "+%Y-%m-%d %H:%M:%S"`"
COMMIT_MESSAGE="$(cat commit.txt)"
rm -f commit.txt
echo $COMMIT_MESSAGE