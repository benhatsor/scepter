<h1 align="center"><img src="/pic/scepter-logo.svg" width="236.94" height="58.44" alt="Scepter"></h1>
<p align="center">
  <h3 align="center">  
    Mobile web inspector
  </h3>
</p>

<p align="center">
  <a target='_blank' href='https://scepter.berryscript.com'><img src='https://img.shields.io/badge/Try-it%20now-brightgreen' alt='Try it now'/></a>
  <a target='_blank' href='https://app.netlify.com/sites/scepter/deploys'><img src='https://api.netlify.com/api/v1/badges/cf90a1a9-767e-440f-974a-6ac36e37da12/deploy-status' alt='Netlify Status'/></a>
</p>

### See the contents of any site

**Scepter** helps you easily understand how a site is built, fix problems, or make tweaks.

### Just type a URL

Combining the power of both **iframes** and **CORS requests**, you can just type a URL to inspect it.

Eg. [scepter.berryscript.com/?url=[URL to inspect]](https://scepter.berryscript.com/?url=https://berryscript.com)

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
- Relative URL CSS `background-image`
- CSS files with cross-origin don't fetch

## Contributing

### Help me improve it 🌱

Some stuff I want to add:

- Inline console
- Edit mode: Add local CSS to element via inline editor
- Show more element properties in Scepter menu

## Change log

[Releases](https://github.com/barhatsor/scepter/releases)

---

### 👨‍💻 🪄 [@barhatsor](https://github.com/barhatsor)
