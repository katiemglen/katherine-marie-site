#!/bin/bash
# Batch push images to GitHub in small groups
# Run between requests or during idle time
# Usage: bash scripts/batch-push.sh

set -e
cd "$(dirname "$0")/.."

BATCH_SIZE=200
IMAGE_DIR="public/images"
BATCH_LOG="scripts/batch-push-progress.json"

# Initialize progress file if it doesn't exist
if [ ! -f "$BATCH_LOG" ]; then
  echo '{"completed_batches": 0, "total_folders": 0, "status": "pending"}' > "$BATCH_LOG"
fi

# Get list of image folders not yet tracked by git on remote
# We'll add folders one batch at a time
FOLDERS=($(ls -d $IMAGE_DIR/*/))
TOTAL=${#FOLDERS[@]}
echo "Total image folders: $TOTAL"

# Read how many batches we've already done
COMPLETED=$(python3 -c "import json; print(json.load(open('$BATCH_LOG'))['completed_batches'])")
START=$((COMPLETED * BATCH_SIZE))

if [ $START -ge $TOTAL ]; then
  echo "All batches already pushed! ✅"
  python3 -c "import json; d=json.load(open('$BATCH_LOG')); d['status']='complete'; json.dump(d, open('$BATCH_LOG','w'), indent=2)"
  exit 0
fi

END=$((START + BATCH_SIZE))
if [ $END -gt $TOTAL ]; then
  END=$TOTAL
fi

BATCH_NUM=$((COMPLETED + 1))
echo "Pushing batch $BATCH_NUM: folders $((START+1)) to $END of $TOTAL"

# Reset the commit to before the big image commit
# Then re-add just this batch of folders
BATCH_FOLDERS=("${FOLDERS[@]:$START:$BATCH_SIZE}")

for folder in "${BATCH_FOLDERS[@]}"; do
  git add "$folder"
done

git commit -m "Image migration batch $BATCH_NUM: folders $((START+1))-$END of $TOTAL" --allow-empty

echo "Pushing batch $BATCH_NUM to GitHub..."
git push origin main

# Update progress
python3 -c "
import json
d = json.load(open('$BATCH_LOG'))
d['completed_batches'] = $BATCH_NUM
d['total_folders'] = $TOTAL
d['last_batch_end'] = $END
d['status'] = 'complete' if $END >= $TOTAL else 'in_progress'
json.dump(d, open('$BATCH_LOG', 'w'), indent=2)
"

echo "Batch $BATCH_NUM complete! ✅ ($END/$TOTAL folders pushed)"
