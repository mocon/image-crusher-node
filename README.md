# Image Crusher

Testing a Node.js Lambda function to crush images after uploading to S3.

### Dependencies

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)

__Note:__ For the binary dependencies to work properly within the Lambda environment, the `yarn` command below must be run within a Linux environment.

One option is to run a local Docker container, using the `ubuntu` image. After running `yarn` within that environment, make a .zip file containing `index.js` and the newly created `node_modules` folder, and upload it to Lambda.

### Install

```
yarn
```

### Clean

Deletes the `node_modules` directory, cleans the Yarn cache, and re-installs the dependencies.

```
yarn run clean
```
