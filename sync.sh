#!/bin/bash

PUBLIC="../binumi.com/public/"
ASTRO_DIST="./dist/"

rsync -av --delete \
  --exclude=".well-known/" \
  --exclude="media/" \
  --exclude="pages/" \
  --exclude="static/" \
  --exclude=".htaccess" \
  --exclude="503.html" \
  --exclude="browserconfig.xml" \
  --exclude="channel.html" \
  --exclude="crossdomain.xml" \
  --exclude="favicon.ico" \
  --exclude="google946e14e0f8ff101b.html" \
  --exclude="index.php" \
  --exclude="php_compatible_pack.php" \
  --exclude="sitemap.xml" \
  $ASTRO_DIST $PUBLIC