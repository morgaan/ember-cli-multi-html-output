# ember-cli-multi-html-output

Ember CLI is designed to build one single `.html` file which is a compiled version of the `app/index.html` file.

Sometimes, because of running the same instance of the application under different domains and/or under several environments (e.g. `development`, `staging`, `production`), you need some texts, scripts ids... to be set for the targeted domain/environment.

This addon lets you, at the end of the application build,  override and/or duplicate and then patch the generated `index.html`, with values you configure in the application options. 
The values replace placeholders set into  `app/index.html`.

## Installation

```shell
ember install ember-cli-multi-html-output
```

## Usage

In your app's `ember-cli-build.js`, define `multiIndex` options on your app instance as such:

```javascript
const app = new EmberApp(defaults, {
  multiIndex : {
    defaults: {
      'LOCALE_LANGUAGE': 'de',
      'LOCALE_COUNTRY': 'DE',
      'LOCALE_TLD': 'de'
      'SOME_TEXT': {
        'default': 'Some default text for dev'
      }
    },
    targets: [
      {
         outputPath: 'index.html',
         macros: {
           'PAGE_TITLE':  {
             'default': 'My dev german app',
             'production': 'My prod german app',
           },
           'SOME_TEXT': {
             'production': 'Some text for german prod'
           }
         }
      },
      {
         outputPath: 'index-fr.html',
         macros: {
           'LOCALE_LANGUAGE': 'fr',
           'LOCALE_COUNTRY': 'FR',
           'LOCALE_TLD': 'fr',
           'PAGE_TITLE':  {
             'default': 'My dev french app',
             'production': 'My prod french app',
           },
           'SOME_TEXT': {
             'default': 'Some text for french dev'
             'production': 'Some text for french prod'
           }
         }
      }
    ]
  }
});
```

In your app's `app/index.html`

```html
<!DOCTYPE html>
<html lang="LOCALE_LANGUAGE">
  <head>
    <title>PAGE_TITLE</title>
  </head>
  <body data-language="LOCALE_LANGUAGE" data-country="LOCALE_COUNTRY" data-tld="LOCALE_TLD">
    <p>SOME_TEXT</p>
  </body>
</html>
```

You end up after build `-env production` with:

In `dist/index.html`:
```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <title>My prod german app</title>
  </head>
  <body data-language="de" data-country="DE" data-tld="de">
    <p>Some default text for german prod</p>
  </body>
</html>
```

In `dist/index-fr.html`:
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <title>My prod french app</title>
  </head>
  <body data-language="fr" data-country="FR" data-tld="fr">
    <p>Some default text for french prod</p>
  </body>
</html>
```

The `index-fr.html` for build `-env development` look like below:
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <title>My dev french app</title>
  </head>
  <body data-language="fr" data-country="FR" data-tld="fr">
    <p>Some default text for french dev</p>
  </body>
</html>
```
