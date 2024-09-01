#!/bin/bash

# Path to the package.json file
package_json="./package.json"

# Replace the version with 0.0.0
if [[ "$(uname)" == "Linux" ]]; then
  sed -i 's/"version": "[^"]*"/"version": "0.0.0"/' "./package.json"
elif [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' 's/"version": "[^"]*"/"version": "0.0.0"/' "./package.json"
fi
