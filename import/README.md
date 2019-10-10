# import

This package handles importing set data from Smogon and third party sources as well
as data about the pools random Pokemon sets are generated from for use by the Pokémon
Showdown damage calculator UI. While the top level package houses UI and view logic, this
package contains code which runs on the server as part of the build process. This package is
only run as needed and as such it is not declared in the main package's `subPackages`.

This package is also distributed under the terms of the [MIT License][1].

   [1]: https://github.com/smogon/damage-calc/blob/master/import/LICENSE
