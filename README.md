# `only-show`

A Web Component
for showing or hiding content
when given conditions are met.

**[Demo](https://oddbird.github.io/only-show/demo.html)**

## Examples

General usage example:

```html
<script type="module" src="show-when.js"></script>

<show-when has-param="edit">
  This will be visible by default,
  but will hide
  if the current url
  does not have
  the `edit` query parameter attached.
</show-when>

<show-when has-support="container-name: any" hidden>
  This will be hidden by default,
  but show up in browsers
  that support container queries.
</show-when>
```

Example using `has-any` option:

```html
<script type="module" src="show-when.js"></script>

<show-when has-hash="slide-2" has-param="show_all" has-any>
  This will be visible
  if either the hash or query parameter
  is present in the URL
</show-when>
```

## ToDo

- Add support for container queries
- Watch for resize and hashChange and other events

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@oddbird/only-show): `npm install @oddbird/only-show`
1. [Download the source manually from GitHub](https://github.com/oddbird/only-show/releases) into your project.
1. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)

### Usage

Make sure you include the `<script>` in your project (choose one of these):

```html
<!-- Host yourself -->
<script type="module" src="show-when.js"></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://www.unpkg.com/@oddbird/only-show@1.0.0/only-show.js"
></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://esm.sh/@oddbird/only-show@1.0.0"
></script>
```

## Credit

With thanks to the following people:

- David Darnes for the [Component Template](https://github.com/daviddarnes/component-template).

## Support

At OddBird,
we enjoy collaborating and contributing
as part of an open web community.
But those contributions take time and effort.
If you're interested in supporting our
open-source work,
consider becoming a
[GitHub sponsor](https://github.com/sponsors/oddbird),
or contributing to our
[Open Collective](https://opencollective.com/oddbird-open-source).
