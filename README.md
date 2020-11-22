# [rafaeleyng's blog](https://rafaeleyng.github.io/)

## branches

- `dev`: is the default branch
- `master`: is the branch deployed to Github Pages, with generated code

## install

The recommended way to manage the software versions for this project is using [asdf](https://github.com/asdf-vm/asdf).

```shell
asdf install # installs software specified in `.tool-versions` file
yarn install # installs Javascript dependencies
```

## run

```shell
yarn run export # to generate the posts files
yarn start
```

## create a post

```shell
yarn create-post "My new post"
```

## deploy

Just commit everything in the `dev` branch and run:

```shell
yarn deploy
```
