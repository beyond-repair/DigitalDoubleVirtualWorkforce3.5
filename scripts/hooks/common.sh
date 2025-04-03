#!/bin/sh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Error handling
error() {
    echo -e "${RED}Error: $1${NC}" >&2
}

success() {
    echo -e "${GREEN}Success: $1${NC}"
}

# Validation helpers
is_branch_name_valid() {
    echo "$1" | grep -qE '^(feature|bugfix|release)/[a-z0-9-]+$'
}
