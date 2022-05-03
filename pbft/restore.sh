#!/bin/bash

HOST="localhost"
PORT="3001"
REMOTE_DB="BC4"
LOCAL_DB="BC4"
USER="aadish"
PASS="thebeast123"

## DUMP THE REMOTE DB
echo "Dumping '$HOST:$PORT/$REMOTE_DB'..."
mongodump --host $HOST:$PORT --db $REMOTE_DB -u $USER -p $PASS

## RESTORE DUMP DIRECTORY
echo "Restoring to '$LOCAL_DB'..."
mongorestore --db $LOCAL_DB --drop dump/$REMOTE_DB

## REMOVE DUMP FILES
echo "Removing dump files..."
rm -r dump

echo "Done."
