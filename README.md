Smalltalk-78
============
Smalltalk-78 is a variant of Smalltalk-76 stripped down to work on the portable "NoteTaker" machine.
In this repository is a Virtual Machine written in JavaScript to run a Smalltalk-78 snapshot in the web browser.

To learn more, please read our paper [Reviving Smalltalk-78: The First Modern Smalltalk Lives Again][paper].
The full history of various Smalltalk releases is covered in Dan's [Evolution Of Smalltalk][hopl] article,
which also includes links to a live version using this VM.

The [index.html][standalone] in this directory should give you a running version for testing, although the browser integration is incomplete (e.g. copy/paste or file management). Pull requests welcome!

The full simulation environment including a graphical VM debugger is on the [Lively Smalltalk-78][lively] page. 

You may also try Alan Borning's [Thinglab][thinglab] which runs on this VM.

All of these work best in **Google Chrome**. Again, pull requests to improve browser compatibility are very welcome!

[lively]: https://lively-web.org/users/bert/Smalltalk-78.html
[standalone]: https://codefrau.github.io/Smalltalk78/
[thinglab]: https://www.cdglabs.org/thinglab/
[paper]: https://freudenbergs.de/vanessa/publications/Ingalls-2014-Smalltalk78.pdf
[hopl]: https://smalltalkzoo.computerhistory.org/papers/EvolutionOfSmalltalk.pdf
