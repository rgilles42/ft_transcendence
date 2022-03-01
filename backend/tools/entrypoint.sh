
npm install

if [ $? != 0 ]; then
	rm -fR node_modules
	npm install
fi

npm run build
npm run typeorm:migration:run

npm run start:prod

