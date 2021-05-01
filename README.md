# juice-js6
ES6 Update to Juice JS
# Juice JS ES6

![Alt text](https://raw.githubusercontent.com/chriskirby81/juice-js/master/brand/logo-med.png "")

Pure Javascript Require class based framework ES6 Rewrite.

## Install Juice JS

To add Juice JS to your project add this line of code.

```<script type="text/javascript" src="src/juice.js" ></script>```

  Simply change **src** value to match your website or app path.
  
  OR import it into a module as follows.
  
  ```
  import JuiceJS from 'JUICE_SRC_DIR/juice6.mjs';
  
  const juice = new JuiceJS( CONFIG_OPTIONS: Object, EXPOSE: Boolean );
  
  ```
  
  ***
  

## Configure Juice JS

```<script type="text/javascript" src="src/juice.js" data-config="[optional]" data-require="[optional]" data-onready="[optional]"></script>```

### Optional Parameters (Data Tags)

  **data-config**: Path to configure file (*Optional*)
  
  **data-require**: Path to dependants file (*Optional*)
  
  **data-onready**: Path to startup file or Startup Function (*Optional*)
  
  **data-pulp**: Comma Seperaed list of core modules to include at startup.
  
  **data-name**: Variable name you want to access Juice JS defaults to **"juice"**
  ***
  
### Configuration Options

Configuration Options can be set directly as a JuiceJS argument or as a path to a configuration file.

```

const CONFIG_OPTIONS = {
  require: ['Module Path 1', 'Module Path 2', ... ],
  paths: {
    modules: {
      [EXTERNAL_MODULE_KEY]: "EXTERNAL_MODULE_PATH"
    }
  }
}

const juice = new JuiceJS( CONFIG_OPTIONS );

```

## Using Juice JS

### Using from Global (window) Context

#### Accessing the global Juice Context
  By default you can access the juice content by the var "juice"

### Using from Modules

### Defining Custom Modules

```javascript

TODO ES6

```

#### Optional Parameters (Data Tags)

**extend:** (string for single array for multiple ) Extends the returned module with defined modules chained.

### Loading Modules

#### Dynamically

```javascript

TODO ES6

```

#### At Module Load

```javascript 

TODO ES6

```

