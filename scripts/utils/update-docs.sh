#!/bin/sh

# Configuration
DOC_FILE="document.md"
TEMP_FILE="document.tmp"

# Update documentation based on changes
update_docs() {
    local files="$1"
    local changes=""
    
    # Generate documentation updates
    for file in $files; do
        if [ -f "$file" ]; then
            changes="$changes\n- Updated: $file"
        fi
    done
    
    # Add changes to documentation
    if [ ! -z "$changes" ]; then
        echo "## Latest Changes\n$changes\n" > "$TEMP_FILE"
        cat "$DOC_FILE" >> "$TEMP_FILE"
        mv "$TEMP_FILE" "$DOC_FILE"
    fi
}

update_docs "$@"
