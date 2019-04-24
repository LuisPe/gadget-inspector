# Inspector Gadget v0.1.0

![ProjectFolder](/gadget.jpg)

> ¿Alguna vez se encontró con un funcionamiento incorrecto cuando despliega una app en NodeJs usando Docker & docker-compose y diferentes entornos (dev, test, production)?

Un posible error es la incorrecta configuración de variables de entorno en **my_api.yml**, provocando un comportamiento extraño en la app NodeJs o que ni siquiera pueda iniciarse, para prevenir este error es que se creó **gadget-inspector package** que permite hacer una validación de las variables de entorno que necesita la app NodeJs y las variables de entorno que fueron configuradas en archivo .yml, esta validación se realiza en tiempo de inicio de container o de la aplicación si está trabajando de manera local.

## Instalación

Usando npm

En la carpeta de su proyecto

```sh
$ npm i gadget-inspector
```

# Importante

> Hay algunas convenciones que deberemos respetar para el correcto funcionamiento del package, estoy trabajando para expandir su funcionalidad y hacerlo lo mas agnóstico posible

1. Configure sus variables de entorno en un arhivo **config.js** en el raiz del proyecto de NodeJs

ejemplo:

```
exports.config = {
  // the environment variables are underscore no camelcase.
  port: process.env.PORT || 3000,
  missingVariableOne: process.env.MISSING_VARIABLE_ONE || "Default value",
  sensibleVariable: {
    missingVariableTwo: process.env.MISSING_VARIABLE_TWO
  }
};
```

> Como puede observar y si aún no se lo imagina hay una de las **missing varibles** que no tiene un valor por defecto, esto es para abordar el caso de que una variable de entorno tenga datos sensibles y no queramos que quede expuesta en nuestro archivo config.js

2.

También quiero que observe que las "key" de las variables son camelCase pero si son de alguna manera iguales a las variables de entorno del "value", ¿que quiero decir con esto?, que como convención no podrá tener una variable similar a esto:

```
other: process.env.MY_OTHER_VARIABLE
```

deberá configurarla de la siguiente manera:

```
myOtherVariable: process.env.MY_OTHER_VARIABLE
```

## Uso

Un ejemplo usando express

```
const app = express();
require("gadget-inspector").inspectorGadget(app);
```

Cuando inicie su aplicación debería ver el siguiente mensaje:

```
Server listen on port: 3000
{"name":"express-docker","hostname":"Thinkpad-580","pid":4194,"level":40,"msg":":::::: HELLO, HERE THE INSPECTOR GADGET WANTS TO TELL YOU SOME THINGS THAT HE FOUND AND MAY BE INTERESTED ::::::","time":"2019-04-24T18:24:46.318Z","v":0}
{"name":"express-docker","hostname":"Thinkpad-580","pid":4194,"level":40,"msg":":::::: ENVIRONMENT VARIABLES CORRECTLY CONFIGURED ::::::","time":"2019-04-24T18:24:46.319Z","v":0}
```

> Todas las variables de entorno que necesita la app NodeJs fueron correctamente configuradas, como puede observar.

Ahora eliminemos las variables de entorno **"MISSING_VARIABLE_ONE y MISSING_VARIABLE_TWO"** e inicemos nuevamente la app.

```
Server listen on port: 3000
{"name":"express-docker","hostname":"Thinkpad-580","pid":4319,"level":40,"msg":":::::: HELLO, HERE THE INSPECTOR GADGET WANTS TO TELL YOU SOME THINGS THAT HE FOUND AND MAY BE INTERESTED ::::::","time":"2019-04-24T18:27:20.879Z","v":0}
1 1
{"name":"express-docker","hostname":"Thinkpad-580","pid":4319,"level":50,"msg":":::::: MISSING ENVIRONMENT VARIABLE(s) EMPTY VALUE :::::: MISSING_VARIABLE_TWO ----> Value: undefined :::: ","time":"2019-04-24T18:27:20.879Z","v":0}
{"name":"express-docker","hostname":"Thinkpad-580","pid":4319,"level":40,"msg":":::::: MISSING ENVIRONMENT VARIABLE(s) DEFAULT VALUE :::::: MISSING_VARIABLE_ONE ----> Value:  \"Default value\" :::: ","time":"2019-04-24T18:27:20.879Z","v":0}
```

El inspector Gadget está trabajando correctamente ahora depende de usted corregir correctamente las variables de entorno y reiniciar la app o dejar todo como está.
