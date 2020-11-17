# quattroMap


## Develop

```bash
# clone the repository
git clone https://github.com/kreis-viersen/quattromap/
cd quattromap
```
Install the deps, start the dev server and open the web browser on `http://localhost:8080/`.

```bash
# install dependencies
npm install
# start dev server
npm start
```

The build process will watch for changes to the filesystem, rebuild and autoreload quattroMap. However note this from the [webpack-dev-server docs](https://webpack.js.org/configuration/dev-server/):

> webpack uses the file system to get notified of file changes. In some cases this does not work. For example, when using Network File System (NFS). Vagrant also has a lot of problems with this. In these cases, use polling. ([snippet source](https://webpack.js.org/configuration/dev-server/#devserverwatchoptions-))

```bash
# build the app
npm run build
```
Once the build is finished, you'll find it at `dist/`.

```bash
# publish files to a gh-pages branch on GitHub
npm run deploy
```

### Search

For the search functionality https://github.com/mapbox/mapbox-gl-geocoder is used.

For your own quattroMap please use your own access token: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/.
