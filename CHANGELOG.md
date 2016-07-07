#version 15.2.4
Updated dev-dependencies

#version 15.2.3
Optimized support serverside rendering

#version 15.2.2
Fixed toolbar biu after moving into subfolder

#version 15.2.1
Updated readme

#version 15.2.0
Moved toolbars from /helpers/ into /helpers/toolbar/
Added more helpers

#version 15.1.4
serverside rendering patch to prevent `window.jQuery` error

#version 15.1.3
Added property `decorator` and 2 helpers:

* composite-decorator
* entity

#version 15.1.2
Passing through arguments of the callback functions

#version 15.1.1
Updated dependencies

#version 15.1.0
Added 2 methods:
* empty()
* reset()

Changed `toolbar-helpers` to return a function that needs to be invoked. This is, because future toolbars mey accept a config.

Optimized some css

#version 15.0.3
Fixed `minHeight` for a disabled editor