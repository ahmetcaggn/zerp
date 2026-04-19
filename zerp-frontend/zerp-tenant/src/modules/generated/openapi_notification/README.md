## openapi_notification@v0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install openapi_notification@v0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://172.16.29.129:8083*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EmailControllerApi* | [**sendEmail**](docs/EmailControllerApi.md#sendemail) | **POST** /notification/email/send | 
*EmailControllerApi* | [**sendEmailToList**](docs/EmailControllerApi.md#sendemailtolist) | **POST** /notification/email/sendToList | 
*EmailControllerApi* | [**sendEmailToListWithHtml**](docs/EmailControllerApi.md#sendemailtolistwithhtml) | **POST** /notification/email/sendToListHtml | 
*EmailControllerApi* | [**sendSingleEmail**](docs/EmailControllerApi.md#sendsingleemail) | **POST** /notification/email/sendSingle | 


### Documentation For Models

 - [EmailEmployeeListRequestDto](docs/EmailEmployeeListRequestDto.md)
 - [EmailListHtmlRequestDto](docs/EmailListHtmlRequestDto.md)
 - [EmailListRequestDto](docs/EmailListRequestDto.md)
 - [EmailSingleRequestDto](docs/EmailSingleRequestDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

