#!/bin/bash

docker exec -it db_user bash -c "mongosh userdb --eval 'db.dropDatabase(); db.getSiblingDB(\"userdb\");'"

if [[ "$1" == "new" ]]; then
  docker exec -it db_user bash -c "mongosh userdb --eval 'db.createUser({ user: \"root\", pwd: \"root\", roles: [\"readWrite\"] });'"
fi