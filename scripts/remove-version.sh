#!/bin/bash

# Path to the package.json file
package_json="./package.json"

# Replace the version with 0.0.0
sed -i '' 's/"version": "[^"]*"/"version": "0.0.0"/' "$package_json"