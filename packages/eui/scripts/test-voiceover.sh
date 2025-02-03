HOST="localhost"
PORT=6006

if nc -z "$HOST" "$PORT"; then
    echo "Storybook is running on $HOST:$PORT. Proceeding with test script ..."
    node ./scripts/test-playwright-voiceover.js
else
#   echo "Storybook is not running on $HOST:$PORT. Please ensure that storybook is running."
    echo "Storybook is not running on $HOST:$PORT. Starting Storybook in a new terminal ..."
    osascript -e 'tell application "terminal"
        activate
            do script "cd Documents/Projects/eui/packages/eui && pwd && yarn storybook --no-open"
    end tell'
    npx wait-on http://localhost:6006/
    echo "Waiting for Storybook to build..."
    sleep 80
    node ./scripts/test-voiceover.js
    osascript -e 'tell application "terminal"
        close
    end tell'
fi