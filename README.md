# Community Edits Bookmarklet

I call this a bookmarklet for lack of a better word to describe this project.

This project is part of the Community Edits platform and contains the part designed to be run on the websites of others, displaying any known edits and sending back proposed edits.

It's my first serious attempt at a TypeScript/Javascript project, and despite the many refactors, I'm actually somewhat happy with it.

# Building
```
npm install
gulp bundle
```

# Dcoumentation
The project uses the global variable `window.ce` for debugging convenience.

The main challenge I had with this project has been getting a consistent interface and behavior across different websites and browsers. From my research, web components was the answer to this problem, but browsers that support it seem limited to Chrome for the moment.

I attempted to use polyfills and web components libraries, but only managed to get poor performance/crashing/style bleed, so I gave up.

Also having issues minifying.

Given what I've learned over the past few months, for the next refactor, I'd like to start moving everything non-ui related into a service worker.
