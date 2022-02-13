
cd ./app

npm install

if [ $? != 0 ]; then
	rm -fR node_modules
	npm install
fi

# Change to what you want, using vue UI (beta) or auto compilation but need to restart container
# vue ui -H 0.0.0.0
npm run serve
