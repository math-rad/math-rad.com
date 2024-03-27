#!/bin/bash

# 3/27/2024 12:51AM; universal tunnel script as an alternative to port forwarding

subdomain = ${$(pwd)##*/}

local_port=$(jq ".$subdomain" ../ports.json)
domain_port = jq ".domainport" ../ports.json
host = jq ".localhost" ../ports.json
proxy=$(jq ".proxy" ../ports.json)

domain = "$subdomain.math-rad.com" 

$(ssh $domain:$domain_port:$host:$local_port $proxy)
