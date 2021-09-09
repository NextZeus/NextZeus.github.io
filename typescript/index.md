# How to Write a TypeScript Library

Writing modular code is a good idea. And nothing is more modular than writing a library. How can you write a TypeScript library? Well, that's exactly what this tutorial is about! This tutorial works with TypeScript 3.x and TypeScript 2.x.

## Step 1: Setup tsconfig.json

Create a project folder, in this tutorial we'll call it typescript-library. Then proceed to create a tsconfig.json in typescript-library. Your tsconfig.json file should look somewhat like this:

```
typescript-library/tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2015",
    "declaration": true,
    "outDir": "./dist"
  },
  "include": [
    "src/**/*"
  ]
}
```

Pretty much like a setup for a non-library project, but with one important addition: You need to add the "declaration": true flag. This will generate the .d.ts files (aka declaration files) which contain the types of your code. This way, if someone is using your library and they also use TypeScript, they get the benefits of typesafety and autocomplete!

Regarding the other options, let's quickly go through those: "module": "commonjs" is required if you want your code to run seamlessly with most current node.js applications. "target": "es2015" specifies which version of JavaScript your code will get transpiled to. This needs to be aligned with the oldest version of node.js you want to support. Choosing es2015 as the compile target makes your library compatible with node.js version 8 and upwards. "outDir": "./dist" will write your compiled files into the dist folder and the include option specifies where your source code lives.

## Step 2: Implement your library

Proceed in the same way, as if you weren't writing a library. Create a src folder and put all the source files of your library (application logic, data, and assets) there.

For this demo, we'll setup a silly hello-world.ts file, that looks like so:

```
typescript-library/src/hello-world.ts
export function sayHello() {
  console.log('hi')
}
export function sayGoodbye() {
  console.log('goodbye')
}
```

## Step 3: Create an index.ts file

Add an index.ts file to your src folder. Its purpose is to export all the parts of the library you want to make available for consumers. In our case it would simply be:

```
typescript-library/src/index.ts
export {sayHello, sayGoodbye} from './hello-world'
```

The consumer would be able to use the library later on like so:

```
someotherproject/src/somefile.ts
import {sayHello} from 'hwrld'
sayHello();
```

You see that we have a new name here, "hwrld", we haven't seen anywhere yet. What is this name? It's the name of the library you're gonna publish to npm also known as the package name!

## Step 4: Configure the package.json

The package name is what the consumer is going to use to import functionality from your library later on. For this demo I have have chosen hwrld since it was still available on npm. The package name is usually right at the top of the package.json. The whole package.json would look like so:

```
typescript-library/package.json
{
  "name": "hwrld",
  "version": "1.0.0",
  "description": "Can log \"hello world\" and \"goodbye world\" to the console!",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

If you don't have a package yet you can create one with npm init and it will guide you through the process. Remember, the package name you choose will be used by people for their imports, so choose wisely!

There's also one all-important flag in this package.json: You have to declare where to find the type declarations! This is done using "types": "dist/index.d.ts" Otherwise the consumer won't find your module!

## Step 5: Configure .npmignore

If you would compile your code now with tsc and run npm publish, you'd publish the dist folder along with all the other files. However, you don't really need the source folder. To avoid publishing unnecessary files to npm, you can create an .npmignore file. In our case it's simple:

```
typescript-library/.npmignore
tsconfig.json
src
```

The only two things we don't need to publish are the tsconfig.json file and the src folder. As your project grows, more files will come, for example test files.

An alternative to using an .npmignore file would be to also copy the package.json into the dist folder, then cd into that folder and publish from there. In that case you'd need to also adjust the paths in the package.json.

## Step 6: Publish to npm

To publish your first version to npm run:

```
tsc
npm publish
```

Now you're all set to go! Consume your library anywhere you want by running:

```
npm install --save hwrld
```

and consume it using

```
import {sayHello} from 'hwrld'
sayHello();
```

For subsequent releases, use the semvar principle. When you make a patch / bugfix to your library, you can run npm version patch, for new features run npm version minor and on breaking changes of your api run npm version major.

Check out the full source of the demo library on github: https://github.com/bersling/typescript-library-starter.

The above tutorial contains all the steps necessary to build & publish a working library. However, you should probably also include some unit tests and you might want to test the behavior of your library locally first, without publishing. Here are some more resources for this:

- How to unit test your library
- How to set up a local consumer without publishing to npm
- How to make your library available as a system command

[Refreence how-to-write-a-typescript-library](https://www.tsmean.com/articles/how-to-write-a-typescript-library/)
