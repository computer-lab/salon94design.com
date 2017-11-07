#!/bin/bash -e
npm run build
npm run git-user
node transformer
