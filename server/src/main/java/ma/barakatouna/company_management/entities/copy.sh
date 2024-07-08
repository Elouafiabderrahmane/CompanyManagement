#!/bin/bash

# Directory containing the files
SOURCE_DIR="./"

# Output file
OUTPUT_FILE="collected_code.txt"

# Check if the source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory does not exist: $SOURCE_DIR"
  exit 1
fi

# Create or clear the output file
> "$OUTPUT_FILE"

# Loop through each file in the source directory
for file in "$SOURCE_DIR"/*; do
  # Check if it is a file (not a directory)
  if [ -f "$file" ]; then
    # Print the file name to the output file
    echo "### Content from file: $file ###" >> "$OUTPUT_FILE"
    # Append the content of the file to the output file
    cat "$file" >> "$OUTPUT_FILE"
    # Add a newline for separation
    echo -e "\n" >> "$OUTPUT_FILE"
  fi
done

echo "All code has been copied to $OUTPUT_FILE"
