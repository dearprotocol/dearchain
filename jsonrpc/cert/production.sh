#!/bin/bash
sudo certbot certonly --standalone
sudo cp /etc/letsencrypt/live/dear-rpc.codepartner.in/fullchain.pem cert.pem
sudo cp /etc/letsencrypt/live/dear-rpc.codepartner.in/privkey.pem key.pem
chown -hR $USER .
