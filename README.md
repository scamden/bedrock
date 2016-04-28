# Welcome to the Shell App

Because I'm tired of typing it, going forward "Angular 1.x" will be referred to
as "A1.x" and 2.0 will be "A2.0".  You've been warned.

## What is the Shell App

It's a Typescript/A1.x based shell that provides the same basic
environment as the CRM web application, including UIQ, Routing, and familiar
build tools.  It also provides all the fun stuff you need to get up and running
with typescript (including build tools, basic type definitions for node,
angular, ES6, etc.).

The goal of the shell app is to provide a "playground" or wrapper that allows you to 
develop new components in isolation.  It's pretty cool.

### Shell App Structure

```
.
├── README.md             You better know what a README.md is
├── app                   The source code for the shell application (super simple angular app)
│   ├── app.scss          SCSS specific to the app shell (should be minimal)
│   ├── index.html        HTML that powers the app shell (should be minimal)
│   ├── index.ts          Boostraps the A1.x shell app (should be minimal)
│   └── tsconfig.json     Typescript project file for the app
├── assets
├── bin                   Build tools
│   ├── headless
│   └── iqb
├── build                 Build tasks
│   ├── feat
│   ├── start-server
│   └── update
├── docker                Tooling needed to deploy the shell app to DCOS
│   ├── Dockerfile
│   ├── README.md
│   └── package.json
├── docker-dev            Tooling needed to build the shell app in TeamCity
│   ├── Dockerfile
│   └── README.md
├── node_modules          node modules... 
├── package.json
├── release               Where all build artifacts end up (this is the WWW root for the local server)
│   ├── assets
│   └── index.html
├── src                   Your module's source code.  99% of your work should be done in here
│   ├── index.html
│   ├── index.scss
│   ├── index.ts
│   └── tsconfig.json
├── typings               Type definitions for non-typescript modules (angular, node, etc.)
│   ├── browser.d.ts
│   └── main.d.ts
└── typings.json          Configuration file that determines which type definitions get installed
```

## Getting Started

This page is powered by `src/index.ts` and `src/index.html`.  They provide the
entrypoint to this UI module.  Start there and build the rest of the module out
inside of `src/`.

By default UI modules export an angular module with a directive.  In the case
of Modals/Dialogs you'll also probably want to export a service that makes the
modal easy to use.  My recommendation is to create that service somewhere in
`src/` and add it to the `angularModule` that gets exported from
`src/index.ts`, then you can inject it normal-style.

The routing for the shell application is handled in `app/index.ts`.  If you
change the name of the root module from `SampleModule` (and you should), then
you'll need to update the default view in `app/index.ts` to reflect the new
root directive.

## A few notes about Typescript

### Type Definitions

Typescript needs to understand where modules are defined and what their type is
to work properly.  To this effect, globals like `module` or `require` or
`angular` will throw compile errors unless you define them.  This is what the
`typings/` directory is for.  To install type definitions for a module that you
want to use, but didn't write, you can run:

```bash
typings install modulename --save --ambient
```

**The order of arguments here matters**.  If you put the `--save` flag before
the module name, it won't work.  sadface.  angry face.

### Classes 

Use classes when you know you'll be `new`ing an object and potentially want to
create a class hierarchy.  **Hierarchies should be kept as shallow as
possible**.  If you do something like `AbstractDataService ->
SpecificDataService -> SpecificDataServiceWithFeature ->
MoreSpecificDataServiceWithMoreFeatures` then I will find you and scold you.
Repeatedly.  Classes are also useful if you need to add intrinsic logic to your
objects (getters, setters, methods).

**Do your best to keep Display logic (eg: anything referenced by a template)
separate from model/business logic (eg: anything referenced by a
service/controller)**

Use interfaces when you want to provide different implementations of the same
contract (eg: a module facade) or when your "type" is so simple and isolated it
doesn't merit an entire class.  This is pretty subjective so use your best
judgement.

## Preparing for A2.0

The app shell is designed to follow an "A2.0-style" structure as much as
possible.  The A2.0 dependency injector provides a shotloaf of awesome new
features, including injector hierarchies, custom providers, etc.  We should
make it easy to move modules over to that structure.

### The A1.x Way

Our traditional A1.x approach is to create a module folder, which contains an
index file, usually a directive definition, a controller, maybe some services,
and some templates:

```
TopNav
├── CustomizeNavDialogCtrl.js
├── TopNav-spec-helper.js
├── TopNavCnst.js
├── TopNavCustomizeSrvc.js
├── TopNavCustomizeSrvc.spec.js
├── TopNavDrtv.js
├── TopNavDrtv.spec.js
├── TopNavListFiltersDrtv.js
├── TopNavSearchBarDrtv.js
├── TopNavSearchBarDrtv.spec.js
├── TopNavSrvc.js
├── TopNavSrvc.spec.js
└── index.js
```

This works really well in A1.x, but in A2.0, controllers, factories, services,
constants...  they aren't things anymore.  Everything is a class, and you
create providers that create instances of classes.

There's an amazing(ly long) write-up about the A2.0 injector at
https://angular.io/docs/ts/latest/guide/dependency-injection.html

### The A2.0 Way

*Disclaimer: this structure is still open for discussion and is subject to
change*

Or at least, using the way I've been structuring modules to prepare for A2.0
way, that directory structure would look more like this

```
src                                   the TopNav module should be it's own repo based on the shell app
├── interfaces                        public contracts that consuming modules need to implement or know about
|   └── ITopNav.ts
├── lib                               lib contains business logic. nothing UI-related should live here
|   ├── constants.ts
|   └── top-nav-customize
|       ├── TopNavCustomize.spec.ts   test: sidecar files next to what they're testing
|       └── TopNavCustomize.ts        the data model / business logic for TopNavCustomization
└── ui                                ALL UI Components live here
    ├── top-nav
    |   ├── index.ts                  This is the only file that has anything to do with angular.
    |   ├── TopNav.spec.ts            Tests the TopNav.ts file without bootstraping an angular-app
    |   └── TopNav.ts                 The 'controller'; should have nothing angular-specific in it
    ├── top-nav-list-filters
    |   ├── index.ts
    |   ├── TopNavListFilters.spec.ts
    |   └── TopNavListFilters.ts
    └── top-nav-search-bar
        ├── index.ts
        ├── TopNavSearchBar.spec.ts
        └── TopNavSearchBar.ts
```

This basic structure tries to make as much of the code as possible
framework-agnostic.  The entirety of a module's business logic (models,
modifications, contracts, validation, etc.) should live in the `lib/` folder.
It should be possible to get 100% unit test coverage of this folder without
involving angular.

The UI folder contains components.  Those components have associated
controllers.  The basic idea here is to perform **no logic in the view**.  This
means (nearly) never accessing model values directly.  If you're tempted to do
something like `ng-if="$scope.viewModel.prop === 'Something'"`, stop
immediately and do this instead: `ng-if="ctrl.currentPropIs('Something')"`.
This makes the views much simpler and the logic easier to test.

**Rule of Thumb:** when implementing a feature, think to yourself "if I decided
to write a CLI tool that did the same thing as the GUI, would I be able to do
that using only the objects in lib?".  If the answer is no, then you should
probably think about refactoring.  *If you're building a UI component (like
popgun, grid, or something like that, then this rule probably doesn't apply).*


## Other Tooling

### iqb deploy

The deploy script will build a webapp docker container that serves assets 
from release/.  Generally, you *shouldn't* run this locally, but instead
should set up CI/CD in TeamCity.

### iqb update

Can be used to fetch updated project tooling from the upstream repository.
This update will overwrite any changes to:

 * `bin/iqb`
 * `build/deploy`
 * `build/start-server`
 * `build/update`

You should not make changes to these files.
