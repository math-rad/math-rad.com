#!/bin/bash

# 3/26/2024 7:45PM; I am hosting multiple services so I must use multiple ports. In order to extract the designated port for the root domain(math-rad.com) I use jq to define and export PORT as the 'root' property of ports.json
PORT=$(jq -r '.root' ../ports.json)

export PORT

react-scripts start