#!/bin/sh

TASKS_FILE="tasks.md"
TEMP_FILE="tasks.tmp"

# Initialize new tasks list with header including timestamp
echo "## New Tasks Generated on $(date)" > "$TEMP_FILE"

# Process each input file to generate a review task
for file in "$@"; do
    if [ -f "$file" ]; then
        echo "- Review updates in $file" >> "$TEMP_FILE"
    fi
done

# Append generated tasks to the tasks file if there are tasks
if [ -s "$TEMP_FILE" ]; then
    cat "$TEMP_FILE" >> "$TASKS_FILE"
fi

rm "$TEMP_FILE"