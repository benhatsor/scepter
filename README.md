<h1 align="center"><img src="/pic/scepter-logo.svg" width="236.94" height="58.44" alt="Scepter"></h1>
<p align="center">
  <h3 align="center">  
    Mobile web inspector
  </h3>
</p>

<p align="center">
  <a target='_blank' href='https://scepter.berryscript.com'><img src='https://img.shields.io/badge/Try-it%20now-brightgreen' alt='Try it now'/></a>
  <a target='_blank' href='https://github.com/barhatsor/scepter/releases'/><img src='https://img.shields.io/github/v/release/barhatsor/scepter' alt='Latest version'/></a>
  <a target='_blank' href='https://app.netlify.com/sites/scepter/deploys'><img src='https://api.netlify.com/api/v1/badges/cf90a1a9-767e-440f-974a-6ac36e37da12/deploy-status' alt='Netlify status'/></a>
</p>

### See the contents of any site

**Scepter** helps you easily understand how a site is built, fix problems, or make tweaks.

### Just type a URL

Combining the power of both **iframes** and **CORS requests**, you can just type a URL to inspect it.

Eg. [scepter.berryscript.com/?url=**https://time.com**](https://scepter.berryscript.com/?url=https://time.com)

### Mobile first

There's no reason to have to open the computer just to inspect. Tap and swipe to roam the site.

<p align="center">
  <img src="https://media.giphy.com/media/woc5Fv841xPvYR11vq/giphy-downsized-large.gif" alt="Scepter Tutorial">
</p>

## Tutorial

Here's how to use it:

- Go to [scepter.berryscript.com](https://scepter.berryscript.com)/?url=\[URL to inspect\]
- Long press an element to bring up the Scepter menu.
- Tap the Scepter menu to see the element's classes and children.

## Caveats

Pages won't load in these cases:

- 403 (Forbidden) on some sites
- Relative URL CSS `background-image` ([#3](https://github.com/barhatsor/scepter/issues/3))
- CSS files with cross-origin don't fetch ([#1](https://github.com/barhatsor/scepter/issues/1))

## Contributing

Thanks! Add yourself to `CONTRIBUTORS.md` when you're done 😊

Some ideas to riff on:

- [ ] Inline console
- [ ] Show element styles
- [ ] Add local CSS to element using inline editor

Make a pull request to the [`dev`](https://github.com/barhatsor/scepter/tree/dev) branch.

Please create a GitHub issue if there is something wrong or needs to be improved.

## Changelog

[Releases](https://github.com/barhatsor/scepter/releases)

## License

[MIT](https://github.com/barhatsor/scepter/blob/main/LICENSE)
