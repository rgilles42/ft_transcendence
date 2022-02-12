
cd ./app

npm install

if [ $? != 0 ]; then
	rm -fR node_modules
	npm install
fi

npm run start:dev
