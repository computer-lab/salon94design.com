#!/usr/local/bin/bash -e

shopt -s globstar

cat contrib/clean-uploaded-images | while read old; read new
do
    sed -i '' "s@$old@$new@g" src/data/**/*.yml
done
