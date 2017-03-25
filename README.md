# Community Edits Bookmarklet

I call this a bookmarklet for lack of a better word to describe this project.

This project is part of the Community Edits platform and contains the part designed to be run on the websites of others, displaying any known edits and sending back proposed edits.


# Building
```
npm install
gulp bundle
```

# Usage
Append the script to the document, and onload run:
```
window.ce.processPage(cssSelector);
```
where cssSelector is a string specifying the main content of the page, the html elements for which contain text which edits can be proposed for.

If no matching element is found, the rest of the script doesn't run. If no selector string is provided, then the script tries a few common guesses. These can be found in `src/tools/page.ts`.

# Documentation

The main challenge I had with this project has been getting a consistent interface and behavior across different websites and browsers. From my research, web components are the answer to this problem, but browsers that support it seem limited to Chrome for the moment.

I attempted to use polyfills and web components libraries, but only managed to get poor performance/crashing/style bleed, so I gave up.

Also having issues minifying.

Given what I've learned over the past few months, for the next refactor, I'd like to start moving everything non-ui related into a service worker.

# Features

- Single process for edit proposal submission, consistent across different websites.
- Easy proposal submission.
- Highlights and displays proposals in real time.
