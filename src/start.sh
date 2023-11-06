#!/bin/bash

# start server as background process
/srv/WEBSITE/src/start-node.sh &
# start site
cd /srv/WEBSITE/src && npm run serve
#npm run build

