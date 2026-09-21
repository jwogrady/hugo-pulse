# Pulse content model

**Pulse is a content governance layer that happens to render.**

Most themes are presentation with content poured into them. Pulse is the other way
round: the model, the rules and the checks are the product, and the templates are
what makes them visible. A client inherits a set of decisions already made —
what a page is for, what it must declare, what gets indexed, where commerce
attaches — not a stylesheet.

This document is the contract that layer enforces. Templates may only read fields
defined here, and a site that supplies nothing but the required fields must still
build and still look deliberate.

## What the theme does

| | |
|---|---|
| **Define** | the types, the heights, and what each declares — reader, voice, action, schema, media, views |
| **Enforce** | required fields, resolvable references, declared views, the vocabulary gate, no generated intersections |
| **Expose** | what is unfinished, so that a half-built site says so instead of looking done |
| **Render** | from those declarations, never from assumptions baked into a template |

Rendering is last on that list deliberately. A site can be reskinned without
re-authoring (rule 6); it cannot be re-governed without rebuilding everything
downstream, which is why governance is the part that belongs in the theme.

### What is enforced

**Build fails.** These are wrong, not incomplete:

- a section without `title`, `format` or `schema`
- a component reference that does not resolve
- an image without `alt`
- a view requested that its section does not declare
- an item in a section whose `media.required` is true, with no media

**Build warns.** These are unfinished, and a warning is how the site admits it:

- a section with no `reader` — nobody has decided who it is for
- a section with no `action` — the reader arrives and is offered nothing
- a taxonomy term with no authored introduction
- an item with no `summary` in a section that supports `teaser` or `card`

**Never checked.** `voice` cannot be verified mechanically, and a check that
guesses at it is worse than no check — it would be wrong confidently, and people
would write to satisfy it.

### How a check has to observe

**A check that reads the same file the author reads is not an independent
observation. It is the author's intent, restated.**

Every check here must assert against the value that was *consumed*, never the one
that was *declared*. The two look identical until they differ, and the case where
they differ is the one the check exists for.

This is not theoretical. `enableGitInfo = true` sat in this repo's `hugo.toml`,
visible to anyone reading the file, and Hugo discarded it — TOML had scoped it to
the `[frontmatter]` table above. A check grepping the file for `enableGitInfo`
would have passed. `hugo config --format json` reported it absent. The Spectrum
session then found the same flaw live in its own suite: `check.sh` asserted
`timeZone` by regexing `hugo.toml`, so the exact failure it existed to prevent
could pass straight through it.

The rule has teeth here because of inheritance. A section that states no `schema`
is not failing — it may be resolving one from the trunk. A section that states one
may be having it overridden. So:

| check this | not this |
|---|---|
| the resolved value after trunk → branch → leaf | what the file says |
| `hugo config` output | the config file's text |
| a reference that resolved | a reference that is present |
| what a view received | what a type declared |

Two remedies, and they are different:

- **Assert the effective value** — for a setting that may be silently discarded.
- **Assert against the thing that consumed it, never the thing that declared it** —
  for a check that could otherwise agree with the author by construction.

### Exposing the unfinished

The theme builds a governance view in development only, never published: every
warning above, grouped by section, with the page that raised it.

The point is not a score. It is that "we have not decided who this section is for
yet" should be visible while the site is being built, rather than discovered two
years later when someone asks why the services page converts at nothing.

## What a page is for

Pulse engineers a page to find **one specific audience**, in service of the brand.
The method is to **describe a problem in a voice that reader will appreciate and
respond to.**

Everything below is downstream of that sentence.

**A page leads with a problem, not an offering.** "There is water coming through
the kitchen ceiling" is what someone types at 2am. "Emergency Plumbing Services"
is what a business calls it in a brochure. The page has to start where the reader
already is, in the words they already used.

**Voice is targeting, not decoration.** The same facts, written for a homeowner in
a panic and for a facilities manager building next year's budget, are two pages —
because a voice that lands with one bounces off the other. This is why `voice` is
declared on a section rather than left to whoever writes next, and why a service
splits when its audiences need different framing.

**Findability is part of the engineering.** A page perfectly pitched to an audience
that cannot find it has not done its job. That is why taxonomy uses the customer's
vocabulary rather than the industry's, and why indexation comes before everything
else for a business that has no brand yet.

**And it has to end somewhere.** A page that finds the right reader, names their
problem and sounds like someone they trust, and then offers them nothing to do, has
spent all its work and banked none of it. The next action is part of the page, not
a thing bolted onto it afterwards.

The action is not always a sale. A site can be a hub for stakeholders, investors or
existing customers, and "see the address", "read the deck", "book the visit" and
"join the list" are all conversions. What is not acceptable is *no* action.

The test for whether a page should exist: **can you name the one person it is for,
the problem they have right now, and what they do next?** If not, it is a brochure
page — and brochure pages are what most of the internet is already made of.

## The order of work

Boring first. Each step is worthless without the ones above it.

1. **Presentable.** It renders, it reads, it works on a phone.
2. **True.** It says who the business actually is, in terms that resonate with the
   people it wants.
3. **Findable.** Indexed, on the vocabulary customers actually use.
4. **Convertible.** Every page has a next action, and the action works.
5. **Then** traffic is worth paying for.

Buying traffic into a site that fails any of 1–4 is buying visits to a page that
cannot do anything with them. The spend is not wasted later; it is wasted
immediately, and the report will say the channel did not work.

This order is also why Pulse is built in the sequence it is built in. Content model
before rendering, rendering before commerce, commerce as configuration.

## Scope

Three ways of saying the same thing, and all three are load-bearing.

**Everything is an item.** One entity, one storage shape. What a thing *is* — a
page, a post, an image, a service — is a **type** carried by the item, not a
different kind of object. WordPress found this root structure and it is why its
model has survived twenty years of people building things on it that nobody
anticipated.

**A website is a newspaper.** It has defined sections; each section's items share a
reader, voice, media, format and schema; and those items render in one or more
views.

**A website is a folder tree.** Leaves are pages, branches are sections, and the
trunk is what they all share.

The newspaper frame explains what **differs** between one part of a site and
another. The tree frame explains what is **inherited**, and at what height it is
stated. The item frame explains why a template can render something it has never
seen before.

This layer defines what **every entity brand** needs, regardless of what the
business does.

## Types

A type answers exactly one question:

> **What does a template have access to when it renders this?**

Not "what kind of content is this" — that is a filing question, and the tree
already answers it. A type is a **resource contract**. It declares what is
reachable, so that rendering can proceed without guessing:

| a type declares | so that a view can |
|---|---|
| fields | read them without testing whether they exist |
| relations | follow them, in both directions |
| media | know whether there is any, how much, what shape |
| taxonomies | know which ones apply |
| views | know which renderings are legal |
| schema | emit the right node into the graph |

**A view can only render what its type grants.** That is the entire purpose of
having types: not to categorise content, but to bound what a template is allowed
to assume. A template reaching past its type is why themes break the moment they
meet somebody else's content.

### Built-in types

| type | hierarchical | |
|---|---|---|
| `page` | **yes** | the static tree |
| `post` | no | the dated stream |
| `media` | no | files, with provenance |
| `menu` | — | top from sections, side from the hierarchy |
| `component` | no | reusable blocks, no URL of their own |

### Custom types

`service`, `case-study`, `person`, `location`. Defined the same way, with no new
machinery — this is WordPress's custom post type, and it is the extension point
that keeps the core small.

**A domain type that needs a new template in order to exist is evidence the type
system is too weak.** The test for this layer is whether a client site can add a
service by declaring one, rather than by writing Go templates.

### When to reach for a custom type

**When the contract differs.** New fields a template has to be able to rely on, new
taxonomies, new views, a different schema node.

Not for either of the reasons it is usually reached for:

- **Not for an archive.** Sections give list pages away free. Items that merely
  live together and want a listing are a section of `page`s.
- **Not for hierarchy.** `hierarchical` is a property a type *declares*, not a
  thing only pages get. `service` declares it, because a service branches into
  audience variants.

So `page` is **not** the residual bucket for standing, unstructured content. It is
the built-in hierarchical type carrying a minimal contract — title, body, weight,
position in the tree — exactly as in WordPress. A page stops being a `page` when a
template needs to rely on a field the page type does not grant, and at no point
before that.

### Where type definitions live

`data/types/<name>.toml`, shipped with Pulse and inherited by every client site. A
section names the type its items are and may override individual declarations; a
section overriding many of them is using the wrong type.

That keeps **one** definition of what a service is across every client, which is
the reason Pulse exists rather than each site inventing its own.

### The heights that govern types

Not types themselves, but where a type's declarations get resolved:

| | |
|---|---|
| **Trunk** | the site; what every branch shares, stated once |
| **Sections** | branches; name their items' type and override what differs |
| **Views** | the renderings an item appears in — full, teaser, card, feature, mention |
| **Schema** | one connected JSON-LD graph; the type declares the node, the view decides what is emitted |

### Lineage

This model is taken from [WordPress's default post
types](https://developer.wordpress.org/themes/classic-themes/basics/post-types/),
because that set has survived twenty years of every kind of site being built on it
and the vocabulary is already in everyone's head.

The part worth copying is not the list — it is that **everything is a post.** A
page, an image, a menu item and a reusable block are all rows in the same table,
distinguished by a type column. Nothing in WordPress is a special case at the
storage layer, which is why a custom post type is a declaration rather than a
subsystem. That is the root structure, and it is what this model takes.

| Pulse | WordPress | |
|---|---|---|
| Pages | `page` | hierarchical, static, outside the feed |
| Posts | `post` | non-hierarchical, timestamped, in the feed |
| Media | `attachment` | files and their metadata |
| Menus | `nav_menu_item` | |
| Components | reusable blocks (`wp_block`) | |
| — | `revision` | git does this |
| — | `wp_template`, `wp_template_part` | Hugo layouts; theme, not content |

Three deliberate divergences:

- **Posts carry tags only, not categories.** WordPress gives posts a hierarchical
  taxonomy *and* a flat one. Pages already provide the hierarchy; a second tree
  over the flat type earns its complexity only on sites large enough to need it,
  and none of ours are yet.
- **Media is a page bundle resource, not a free-floating record.** WordPress
  attaches media to a post by reference and lets it outlive the parent. Here the
  filesystem enforces the relationship: move the page, the media moves; delete the
  page, the media goes. Orphaned attachments are a WordPress disease we do not have
  to inherit.
- **Components are headless bundles, not a post type.** They have content and
  media but never a URL, a menu entry, a list position or a sitemap line.

## Design rules

**1. Generalise, never bespoke.** These types describe *an entity brand*, not any
particular business. Anything hardcoded to one company is a defect in the
foundation, not a detail of a deployment.

**2. Every field is optional unless marked required.** A new client has almost
nothing. A template that assumes a field exists is broken for the customer who has
not written it yet.

**3. Three of everything is the design target.** Not zero, and not one. Zero and one
get written as test cases because they announce themselves as edge cases; *sparse
but plural* is the shape that passes for normal, so nobody writes it and nothing is
built to survive it. Three pages, three posts, three tags is what a real site looks
like in month one, and every aggregate, ranking, grouping and "related" feature has
to degrade honestly there. See [Fixtures](#fixtures).

**4. Use schema.org's vocabulary where one exists.** Do not invent a field name for
something `WebPage`, `Article`, `ImageObject`, `Organization` or `Person` already
names. Structured data is not a later feature to bolt on — it is why the field is
called what it is called. See [Schema](#schema).

**5. Reference by page path, never by a shadow taxonomy.** A taxonomy whose terms
mirror page slugs is two sources of truth that drift the moment someone renames
one. Cross-references resolve with `.GetPage`.

**6. The model outlives the theme.** WordPress's own guidance is that content types
belong in a plugin rather than a theme, so that content survives a theme change.
The same rule holds here, and it is why this document exists as a contract rather
than as templates: a client must be able to reskin without re-authoring. If a field
is defined only by the template that reads it, it is not part of the model — it is
an accident of the current design.

## The trunk

What every branch shares. Declared once, in site config, and inherited by
everything below unless something overrides it.

| param | notes |
|---|---|
| `schema.*` | the organisation node — see [Schema](#schema) |
| `style` | the base visual treatment |
| `voice` | the house voice; a section deviates from it deliberately, not accidentally |
| `media` | the default media contract |
| `views` | the views a section supports unless it says otherwise |

The trunk is also where the entity lives: the organisation, its name, its logo, the
profiles it controls. One node, one place, referenced everywhere else.

## Inheritance

Three heights, resolved nearest-first: **leaf → branch → trunk.** A branch inside a
branch resolves through its parent branch first.

A leaf states only what makes it different from its branch. A branch states only
what makes it different from the trunk. A field that has to be set at every height
is a field whose default is wrong — fix the default rather than repeating the
override.

**Anything with children is a branch. Anything without is a leaf.** That is the
whole rule, and it is also Hugo's own distinction between a branch bundle
(`_index.md`) and a leaf bundle (`index.md`). A page that grows children becomes a
section and starts declaring for them; nothing in front matter needs to change
hands for that to happen, because the tree already said it.

## Sections

A section is a branch: a division of the paper, not a folder that happens to have
pages in it. Sports and Obituaries run in the same newspaper and share none of
their treatment — different photography, different headline shape, different voice
— and a reader can tell which section they are in without reading the masthead.

A section declares what its items have in common. Everything in it inherits that;
an item overrides only where it genuinely differs.

Declared in the section's `_index.md`:

| field | type | required | notes |
|---|---|---|---|
| `title` | string | **yes** | |
| `type` | string | **yes** | the type its items are — the resource contract, see [Types](#types) |
| `schema` | string | **yes** | the schema.org type its items are — see [Schema](#schema) |
| `reader` | string | no | the one person this section is written for |
| `voice` | string | no | how it sounds to that reader; targeting, not decoration |
| `action` | map | no | the next action its items offer — see [Integrations](#integrations-not-projects) |
| `style` | string | no | visual treatment key; selects the section's typographic and colour handling |
| `media` | map | no | the media contract for items — see below |
| `views` | list | no | which views items support; defaults to `[full, teaser]` |
| `itemType` | string | no | `page` or `post`; defaults from whether items are dated |

`media` declares what items in this section carry:

| key | notes |
|---|---|
| `required` | bool — an item without media is a build error in this section |
| `aspect` | e.g. `16:9`, `1:1`; the crop items are held to |
| `max` | how many; `1` for a lead image, unset for a gallery |
| `profile` | processing profile name — see [Media](#media) |

A Team section requires one 1:1 headshot. A Case Studies section allows an
unbounded 16:9 gallery. A Policies section carries no media at all and says so, so
that a missing image is never mistaken for an oversight.

**`reader` and `voice` are the targeting.** Neither renders. They exist so that
whoever writes the next item — a person, or a model — knows who it is for and how
it should sound, without reverse-engineering both from the items already there.

They are also the test from [What a page is for](#what-a-page-is-for), applied one
level up. A section that cannot name its reader in a phrase is not a section yet.
A section whose voice cannot be stated in a sentence is usually two sections that
have not been separated.

## Views

An item renders in one or more views. Same content, different jobs — the newspaper
prints a story on the front page as three lines and a photograph, and on page
eleven in full, and neither is a degraded version of the other.

| view | job |
|---|---|
| `full` | the item's own page |
| `teaser` | a row in its section index |
| `card` | a tile in a grid |
| `feature` | promoted placement outside its own section |
| `mention` | an inline reference inside someone else's prose |

Every section supports `full`. Everything else is declared, and a view a section
does not declare is never rendered — asking for one is a build error rather than a
silent fallback to `full`, which is how a card grid quietly fills with whole
articles.

Views are the reason `summary` and the media contract exist. A `teaser` has a
title, a summary and at most one image; if an item has no summary, the view has to
make one and will make it badly. Sections that support `teaser` or `card` should
consider `summary` effectively required even though the field is optional.

## Schema

Structured data is not a feature added at the end. It is the reason fields are
named what they are named (rule 4), and it is how a client site is legible to
anything that is not a human reader.

Every page emits JSON-LD, and the emissions form **one connected graph** rather
than a pile of unrelated blobs.

### The site is an organisation

Declared once, in site config, with the stable id `{baseURL}#organization`.
Everything else references that id instead of repeating it.

| param | notes |
|---|---|
| `schema.type` | `Organization`, or a subtype — `LocalBusiness`, `ProfessionalService` |
| `schema.name` | |
| `schema.logo` | |
| `schema.sameAs` | list of profile URLs the entity controls |

### A section declares its items' type

| section, typically | `schema` |
|---|---|
| insights, news | `BlogPosting` |
| services | `Service` |
| team | `Person` |
| locations | `LocalBusiness` or `Place` |
| standing pages | `WebPage` |

An item inherits its section's type and may override it. An item whose type
differs from its siblings is usually evidence the section is wrong, not that the
item is special.

### Views decide what is emitted

| view | emits |
|---|---|
| `full` | the item as its declared type, with `mainEntityOfPage` |
| section index | `CollectionPage` wrapping an `ItemList` of its items |
| `teaser`, `card` | an `ItemList` position — never a second full entity |
| `feature` | an `ItemList` position, same as a card |
| `mention` | nothing; the host page's graph owns that reference |
| any page with a parent | `BreadcrumbList` from the hierarchy |

### Rules

- **One node per thing, referenced by `@id`.** Items point at `#organization` as
  `publisher`, `provider` or `author`, as their type requires. Inlining a copy of
  the organisation into every blob is the most common way structured data rots —
  one edit updates nine of the ten copies.
- **Never emit a property whose field is absent.** An empty string in JSON-LD is
  worse than silence: it asserts the value is empty.
- **Never emit what the page does not show.** A rating, review count, price or
  availability in the markup that a reader cannot see on the page is a
  manual-action risk, not a ranking trick.
- **`alt` is structural.** `ImageObject` needs it, which is why it is the one
  required media param.

## Pages and posts

**At the storage layer there is no difference.** Both are items. They are the two
**built-in** types, one hierarchical and one not, and three things follow from
which is which.

A caution before the table: hierarchy is what separates *these two built-ins*, not
what separates pages from every other type. A custom type declares its own
hierarchy — see [When to reach for a custom type](#when-to-reach-for-a-custom-type).

| | page | post |
|---|---|---|
| structure | folders; the shape of the folder **is** the navigation | flat |
| navigation | derived from the tree; stable | derived from taxonomy; changes often |
| lifecycle | a **document** — a snapshot, where provenance matters | a **record** — what is published now is what matters |

The first two rows are mechanics. The third decides how the site is run, and most
content models leave it out entirely.

### Documents and records

**A page is a document.** It states how things are at a moment — a policy, a price
list, a specification, a scope of work. Someone read a version of it and acted on
it, and which version they saw matters.

> Changing a document without version control is like changing the standard
> without telling anyone.

**A post is a record.** You edit it, you add to it, you correct it. History exists
for credit and blame, not for truth. Nobody asks which version of a job note was
live in March; they ask what it says now.

That distinction settles three things:

| | document | record |
|---|---|---|
| an edit needs | a version, a date and a note | nothing |
| the prior state | stays reachable, or is at least identifiable | is git's business |
| "last updated" | is **content** — part of what the page says | is metadata |

### Document fields

**Matched to the Spectrum theme's implementation** (hugo-spectrum PR #14) rather
than invented separately. Three fields, all optional, all independent.

| field | type | notes |
|---|---|---|
| `version` | string | |
| `revised` | date | when it was last revised |
| `revisions` | list of `{date, note}` | renders at the foot, newest first |

```toml
version = "3"
revised = 2026-09-19

[[revisions]]
  date = 2026-09-19
  note = "Callout rate raised from $140 to $165."
[[revisions]]
  date = 2026-09-18
  note = "Added the after-hours exclusion, which was verbal before."
```

`effective` and `supersedes` are **reserved and implemented nowhere.** Neither
theme had a case that exercised them, and three fields that render beat five where
two do not. Add them when a standard genuinely supersedes another, and tell the
other theme.

Rendered as an `<ol>`, newest first, because the order is the point. The machine
`datetime` stays ISO while the visible form is the site's own date format, and both
resolve through the site timezone like every other date — so a revision cannot file
under a day the archive does not have.

Three decisions, taken from Spectrum's implementation:

**All three fields are independent.** A page with `revised` and no list prints the
date and no notes. That is the honest rendering of *this changed and nobody wrote
down what* — visible, and visibly thin. Requiring the list would only produce
`note = "Updated"`.

**Documents only, asserted in both directions.** The negative case is the one with
teeth: a post carrying a revision history claims an accountability the record does
not have. **A post that renders one fails the build.**

**Conversion pages count as documents.** A price is the part of an offer a reader
is most entitled to see the history of.

### The check, and where it can live

With `enableGitInfo`, compare a document's last commit date against its own
`revised` date and warn when the file changed afterwards. The site cannot stop
someone editing a standard quietly, but it can refuse to be quiet about it.

**This check cannot run in a theme repository, and that took an outside eye to
see.** Demo content carries fictional dates by design, and the commit introducing
them is necessarily a different day. Measured here: `contact.md` declares
`revised = 2026-01-05`, git records the commit as `2026-09-21`, and the check fires
— on a correct repository, permanently. A check that cries wolf gets switched off,
which is worse than not having one. Caught by the Spectrum session before either
of us shipped it.

So it is **scoped to real documents**, by one guard:

**`sampleContent` is page-level only. There is no site-level form, deliberately.**

A site-level flag is defeated by exactly the behaviour it defends against. The
reason a fabricated rating is dangerous in a demo is that people copy demo
directories without reading them — and the natural way to start a client site is
to copy the config and edit it. One inherited line would silently disable the
check on every document that client ever writes, including ones authored months
later with nothing to do with sample content.

Page-level fails in the right direction:

- a client who copies our pages gets **flagged** pages, and clearing them is
  per-page and visible in the diff
- a client who writes **their own** page gets the check live immediately, whatever
  they inherited or failed to clear

The cost is a flag on all 26 demo pages instead of one line in config. That is the
correct price: the demo is the thing making the declaration, so the demo is where
the declaration should be verbose. A one-line site-level switch is cheap for us and
expensive for every client, which is the wrong way round.

Any site-level escape hatch added later must be **named for what it does, not for
what the content is** — something a client would have to type on purpose and would
look wrong in their config.

### The skip has to be audible

A guard that silently disables the check reintroduces the quietness one level up. A
build where the check did not run is otherwise indistinguishable from one where it
ran and passed, which is the same failure the check exists to prevent.

So the exemption is announced once per build, naming the guard and the count of
documents skipped.

**Decided before wiring, because the obvious implementation is a trap.** Emitting
it with `warnf` fails any build running `--panicOnWarning` — including our own,
against our own demo. Suppressing it returns us to silence. So the announcement
uses a warning with a **stable ID**, and a repository running `--panicOnWarning`
must either clear its sample flags or suppress that specific ID in config.

Both are deliberate, visible acts. Silence is not available by default, which is
the whole point.

The alternative — comparing against the commit that last touched the *body* rather
than the file — is more precise, since a front-matter-only edit bumping `revised`
is not a silent change and is what trips the naive version. It is also not
reachable from a Hugo template, so it would mean a check outside the build.

Records are exempt regardless. A post that changed after its date has just been
edited, which is what posts are for.

### Page fields

| field | type | required | notes |
|---|---|---|---|
| `title` | string | **yes** | |
| `summary` | string | no | falls back to the rendered summary |
| `weight` | int | no | order among siblings; unset sorts last, then by title |
| `components` | list of paths | no | see [Components](#components) |
| `nav` | bool | no | default `true`; `false` hides the page from tree navigation without unpublishing it |
| `menu` | string | no | `top` or `footer` — see [Menus](#menus) |

Structurally: a leaf is `index.md` in its own directory when it carries media, or a
plain `.md` file when it does not. The directory tree *is* the hierarchy — nothing
in front matter declares a parent, so the structure cannot disagree with itself.

### Post fields

| field | type | required | notes |
|---|---|---|---|
| `title` | string | **yes** | |
| `date` | date | **yes** | |
| `tags` | list | no | **subjects** — see [Taxonomies](#taxonomies) |
| `summary` | string | no | |
| `components` | list of paths | no | |

Posts are the only type that appears in feeds.

## Media

Media files are **page bundle resources**, never `static/`. A file lives with the
page that uses it, so moving the page moves its media and deleting the page
deletes it.

Every file carries provenance. Original material from real work is the signal a
stock library cannot forge, so the credit is part of the contract rather than a
nicety.

| param | required | applies to | notes |
|---|---|---|---|
| `alt` | **yes** | images | empty string only if genuinely decorative |
| `title` | no | all | |
| `caption` | no | all | |
| `credit` | no | all | who made it |
| `shot_where` | no | images, video | |
| `shot_on` | no | images, video | |

**Images.** Processed by profile. A section names the profile its items use; a view
selects the variant it needs, so a card never downloads a full-width lead image.

| profile | max width | output | for |
|---|---|---|---|
| `lead` | 1400 | WebP q82 | an item's main image, `full` view |
| `gallery` | 1400 | WebP q82 | sequences, `full` view |
| `portrait` | 800 | WebP q82 | headshots, 1:1 |
| `thumb` | 480 | WebP q80 | `teaser`, `card`, `mention` |

Narrower than the profile's max, an image is served as-is rather than upscaled.
Every `<img>` carries intrinsic `width` and `height`, `loading="lazy"` and
`decoding="async"`.

**Documents.** Linked, never inlined. The rendered link states file type and size,
because a reader deserves to know what a click costs.

**Video.** Self-hosted files get a `poster`; third-party video is a component, not
a resource, because it is an embed rather than a file.

A page with twelve images and a page with none are both normal.

## Menus

**Two. Top navigation and footer.** That is the whole list.

Side navigation is not a menu. It is the folder tree rendering itself. Pages
already declare their structure by where they sit, so a side nav maintained as its
own list would be a second source of truth for something the filesystem already
knows — and the two would drift, silently, in the direction of whichever one
somebody remembered to update.

| menu | built from |
|---|---|
| `top` | top-level sections, plus anything declaring `menu = "top"` |
| `footer` | anything declaring `menu = "footer"` |

Order by `weight`. `nav = false` removes a page from tree navigation without
unpublishing it.

Posts have no menu presence. They are reached by recency, by taxonomy, and by being
linked to.

## Templates are forms

A template is a form. Fields fill it.

The content does not know which template it lands in. The template does not know
what content it will get — only what the type grants it access to. That is the
bound from [Types](#types), stated from the other side: the type declares what is
available, the template declares what it needs, and neither reaches past the
contract between them.

**The header assembles the sources** — styles, scripts, the schema graph, the
template itself — so that nothing downstream has to know where anything came from.

A template that works with exactly one piece of content is not a form. It is that
content, written in Go.

## Components

Reusable blocks of page content, authored once and inserted on many pages.

Components live in `content/components/` as **headless bundles** — they have
content and may carry their own media, but they have no URL of their own. A
component is not a page and never appears in a menu, a list or a sitemap.

| field | type | required | notes |
|---|---|---|---|
| `kind` | string | **yes** | selects the rendering; see below |
| `title` | string | no | |

Plus whatever fields that `kind` defines.

### Insertion

Two mechanisms, deliberately:

**By front matter** — `components: ['/components/consultation-cta']` renders the
listed components in order, after the page body. For blocks that belong to the page
as a whole.

**By shortcode** — `{{< component "consultation-cta" >}}` renders it at that point
in the body. For blocks that belong at a specific place in the prose.

A component referenced by a path that does not resolve is a build failure, not a
silent omission. Reuse is only safe if breaking it is loud.

### Kinds

The starter set. Extensible — a new kind is a template plus an entry here, and
adding one must never require touching a page that does not use it.

| kind | carries |
|---|---|
| `prose` | body only; the escape hatch |
| `cta` | heading, body, one link |
| `cards` | a list of `{title, body, link, media}` |
| `quote` | quote, attribution, optional link |
| `gallery` | bundle images, in resource order |
| `faq` | a list of `{question, answer}` |
| `embed` | third-party media by URL |
| `booking` | a label and a URL; the booking system is somebody else's |
| `form` | fields, a submit label, and an endpoint to post to |

## Navigation and intent

Taxonomy here is not a filing exercise. It exists so that search engines and
chatbots can find the site, and so that a customer lands on the version of a
service that matches why they are looking.

**Pulse makes these calls so that client sites do not have to.**

### The rule

**A taxonomy dimension exists only if customers name it.** By industry standard
where one governs, and in the customer's own words where the two differ — because
their words are what gets typed into a search box or asked of a chatbot.

The test is one question: *would a customer say this phrase?* If the answer is no,
it is internal filing and does not belong in a taxonomy. Internal filing is what
the tree is for.

This is also the gate for indexing a term, which makes it the only gate. A phrase
customers use has demand behind it whether one service sits under it or nine.

Applied to this site's own terms:

| term | would a customer say it? | verdict |
|---|---|---|
| Emergency | "emergency plumber" — high demand | keep |
| Commercial | industry standard and customer phrase | keep |
| Residential | same | keep |
| After Hours | said, less often, still said | keep |
| Scheduled | nobody searches "scheduled plumber" | **drop** |

`Scheduled` was internal vocabulary wearing a customer-facing costume. It is not a
thing anyone asks for; it is the absence of an emergency. A service with no
`response` term is a scheduled service, and the absence carries the meaning without
a page having to.

### Indexation comes first

Until a business has a brand, has sold to its first customer, and is actually
running, **direct traffic is almost useless**. Discovery is the only channel it
has. So Pulse indexes by default and treats being findable as the priority.

The opposite instinct — withhold pages until they have earned their place — is the
right answer for a site with brand equity and the wrong answer for the site Pulse
is built for. A thin-content problem is one you get to have *after* you have pages
worth crawling.

So:

- **Term pages are indexed.** Not on promotion, not on a count.
- **The gate is vocabulary, not volume.** A customer phrase with one service behind
  it still deserves its page, because the phrase is what has demand.
- **A term you will not write an introduction for is a term that should not
  exist.** That is one content decision made once, not an indexing decision
  revisited forever.

### The rule that still holds

**Pulse never auto-generates an intersection.**

No service × area. No audience × response. Indexing by default is not the same as
generating by default, and the two get confused constantly.

Nine counties times three services is twenty-seven pages that differ by a place
name. Nobody searched for any of them in those words, so they fail the vocabulary
test before they fail anything else. A combination page exists when someone has
something to say about the combination — then it is an ordinary authored page, and
it is indexed like everything else.

### Intent has dimensions, and they are not one bag

*Who the customer is* and *what is happening to them right now* are different
questions, and a single list of "categories" conflates them:

| dimension | terms | changes |
|---|---|---|
| `audience` | Residential, Commercial | the whole framing — who decides, how it is priced, what proof matters |
| `response` | Emergency, After Hours | what the reader is doing this minute |

A homeowner at 2am and a facilities manager planning next year's budget may need
the same work done and will not read the same page.

`response` deliberately avoids the name `availability`, which schema.org has
already spent on stock levels.

### How a service serves two audiences

When the content genuinely differs — different pricing model, different process,
different proof — the service becomes a branch and the audiences become its
children:

```
services/hvac-maintenance/
  _index.md          the service
  commercial.md      contract pricing, condition reports, a facilities reader
  residential.md     per-visit pricing, a homeowner reader
```

That is the same leaf-becomes-branch rule as everywhere else, triggered by the same
test: does this need its own page, or is it a paragraph?

When the content does not differ, one page carries both and `audience` records that
it serves both. **Splitting a page that has nothing new to say is how thin content
gets made.**

### Curated landing pages

`/commercial/` is an authored page, not a term listing. It has its own copy about
working with commercial customers and references the services that apply by path.

That gives the destination something to rank on, keeps one source of truth per
service, and means joining the commercial offering is a line in a front matter list
rather than a new page.

## Integrations, not projects

Pulse does not build commerce. It provides the attachment points and gets out of
the way.

A booking page is a page with a booking component pointing at Housecall Pro. A
contact page is a form component posting to Google Forms, which kicks off a
marketing workflow somewhere Pulse never sees. Neither of those is a project. Both
are configuration.

| the need | Pulse provides | somebody else provides |
|---|---|---|
| booking | `bookingUrl`, a `booking` component | Housecall Pro, Calendly |
| contact | a `form` component with an endpoint | Google Forms, Formspree |
| marketing workflow | the form post that triggers it | the CRM |
| payment | a link | Stripe, the invoicing system |
| newsletter | a `form` component | the list host |

### The rules

**An integration is configuration, never code in the theme.** No vendor name
appears in a template. Changing from one booking system to another is a front
matter edit, not a rebuild, and no content is re-authored.

**The theme never holds a secret.** Endpoints are public URLs. Anything needing a
key belongs on the far side of the integration, not in a static site.

**The page works when the integration does not.** A booking widget that fails to
load must still leave a phone number on the page. An entity brand that is
unreachable because a third party is down has been failed by its website, and the
reader will not distinguish between the two.

**Integrations attach to an action, and the action is declared on the section.**
That way every item in a section offers the same next step without repeating it,
and a section that has not declared one is visibly a section nobody has finished.

### Why this is a boundary and not a preference

Rule 6 says the model outlives the theme. The same argument applies harder here:
the model has to outlive the *vendors*. Housecall Pro is a decision a business
makes for a few years, and every client will make a different one. A theme that
knows the name of a booking provider has put a business decision inside a
presentation layer, and it will be wrong for the next client and eventually for
this one.

## Taxonomies

| taxonomy | applies to | means | terms |
|---|---|---|---|
| `tags` | **posts only** | the *subjects* of a post | as written |
| `audience` | services | who the customer is | Residential, Commercial |
| `response` | services | urgency, when customers name it | Emergency, After Hours |
| `service-areas` | services | where it is offered | the counties served |

All of them are indexed. Every term above is a phrase a customer would use, which
is the only gate — see [The rule](#the-rule).

Pages are classified by their position in the tree. They do not carry tags; a page
that wants to be found by subject is a post.

`service-areas` is the one most likely to be misused. Its term pages are indexed
like the rest, because "plumber in Crawford County" is exactly how someone asks.
What it is **not** is a licence to generate a page per service per area — that
crossing fails the vocabulary test, because nobody phrases a search that way.

`tags` means subjects — used sparingly, repeated deliberately, meaningful by
frequency. It is not a keyword bag. This is the same meaning the Spectrum theme
gives the word, deliberately, so a client running both an organisation site and an
owner site has one vocabulary rather than two.

## Shared contract

Settled with the Spectrum theme and **not to be changed unilaterally**. Spectrum
covers the person as subject, Pulse the organisation. These are the only two places
the models touch. Neither applies until domain types are defined — recorded here so
the agreement is not lost.

### The person seam

A person is identified by **the URL of their personal-brand site**. Not a slug, not
an id in a registry — URLs are already globally unique and already resolvable, and
minting one needs no coordination between the two models.

Normal form, required for identity comparison: absolute, `https`, host lowercased,
trailing slash, no query, no fragment — **exactly the person's Hugo `baseURL` as
written**. Comparison is byte equality after that. Stating it that way also settles
`www` without either model adjudicating it.

Without this rule, `https://example.com` and `https://example.com/` are two
different people and nothing in either theme will ever notice.

Direction is **organisation → person**. The org knows its people; a person may have
no organisation, several, or a former one, and their record should not need
rebuilding because someone changed jobs.

### The offer fields

`sku`, `serviceType`, `bookingUrl`, `price`, `currency`, `availability` and
`rating` carry schema.org's meanings in both models. Shared **field vocabulary**,
not shared taxonomy.

## Fixtures and demo content

**Two artefacts, two jobs.** Sample content is asked to do three things that pull
against each other:

1. **Find bugs** — unkind, edge-seeking, deliberately awkward
2. **Be representative** — the shapes real clients actually have
3. **Persuade** — show why this is worth choosing

(1) and (3) conflict directly. A corpus optimised to persuade is flattering, and a
flattering fixture is how the sibling theme's colour-ramp bug survived four
releases: every fixture it had was large enough to hide the failure.

So they are split. One corpus cannot be both the adversarial test and the sales
pitch, and asking it to be produces something that is neither.

### Synthetic fixtures — job 1

Built by the check, in the check, and never committed as content. Free to be as
ugly as they need to be, because nobody reads them.

- **Three of everything.** Not zero, not one. Zero and one get written as tests
  because they announce themselves as edge cases; *sparse but plural* is the shape
  that passes for normal, so nobody writes it and nothing survives it.
- **A corpus of one** — one item, one term. Every aggregate has to degrade
  honestly where there is nothing to aggregate.
- **A term used once beside a term used forty times**, so frequency-driven
  presentation is exercised across its whole range.
- **A branch inside a branch that overrides its parent**, and a leaf that overrides
  its branch. Inheritance is only proven where something disagrees; a tree where
  every height agrees tests nothing.
- **A leaf that becomes a branch**, proving a page changes what it is by acquiring
  a child, with no front matter edited.
- **Every declared view rendered**, and a section declaring only `full`, so the
  absence of `teaser` is proven to be an error rather than a silent fallback.
- **An item with no summary in a section that teases** — the case where a view has
  to invent something and will do it badly.
- **A document whose file changed after its `revised` date**, so the check fires.
- **A page rendered as though its integration failed**, because the fallback is the
  part nobody ever looks at.

### The demo site — jobs 2 and 3

Representative and persuasive, and free to be, because the adversarial work is
happening elsewhere. It should read as a business someone actually runs.

What it has to demonstrate, because these are the claims and prose cannot carry
them:

- **A page per service, not a services page.** Enough services that the difference
  is visible — a URL with its own price and its own photographs, rather than the
  fourth bullet on a list.
- **One service area and nine**, the model working identically at both.
- **A service that branches by audience**, where the content genuinely differs,
  beside one that branches into sub-services. Two reasons to branch, both real.
- **A document that has been revised**, carrying its version and revision date.
- **A next action on every page**, including the one whose action is the phone
  number because the business has no booking system.

### Cold start belongs in both

As a fixture it proves the model degrades honestly with nothing in it. As demo
content it answers the question an owner most wants answered: *what does my site
look like on the day I have nothing?*

That is a selling point, not only a test. Most themes answer it badly and none of
them admit it.

### No invented proof

A model containing a type whose whole purpose is customer-verified proof cannot
ship invented examples of it. A testimonial written by the theme author is a
fabricated review with a neutral filename on it.

So the demo carries **no testimonials, no case studies, no ratings and no review
counts.** Not because they are hard, but because every honest version of them is
either empty or invented — and the business that has none is the one worth showing
anyway.

**Machine-readable fabrication is the worse half**, and it is the half that gets
shipped by accident. A written testimonial is at least legible as prose someone
composed. A `rating` of 4.8 from 37 reviews becomes an `AggregateRating` in the
JSON-LD, and a search engine will act on it — in a directory built to be copied.
The Spectrum session found exactly that in its own demo and removed it.

The line that survives: **a fictional business may make claims about its own
operations; it may not carry proof attributed to customers, and nothing invented
may enter the structured data.** What a callout costs is the demo doing its job.
What a customer thought of it is fabrication with a neutral filename.

Coverage of those capabilities belongs in the synthetic fixtures, which are
adversarial, throwaway, and never copied into anything.

Marking rules for demo content:

- the business is unmistakably fictional and flagged as sample content in config
- telephone numbers use the 555 reservation
- nothing in it could be lifted into a client site and pass as that client's
