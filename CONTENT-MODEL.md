# Pulse content model

The generic content substrate that status26.com and every client site built on
Pulse inherits.

This is a contract, not a suggestion. Templates may only read fields defined here,
and a site that supplies nothing but the required fields must still build and still
look deliberate.

## Scope

Two ways of saying the same thing, and both are load-bearing.

**A website is a newspaper.** It has defined sections; each section's items share a
media, style, format, voice and schema; and those items render in one or more
views. The sections are where the editorial decisions live.

**A website is a folder tree.** Leaves are pages, branches are sections, and the
trunk is what they all share.

The newspaper frame explains what **differs** between one part of a site and
another. The tree frame explains what is **inherited** and where it is stated. A
decision that is hard to place in this model is usually one being made at the wrong
height.

This layer defines what **every entity brand** needs, regardless of what the
business does.

Types:

| | | hierarchical |
|---|---|---|
| **Pages** | the static tree | **yes** |
| **Posts** | the dated stream | no |
| **Media** | files, with provenance | no |
| **Menus** | top (sections) and side (parent–child) | — |
| **Components** | reusable blocks inserted into pages | no |

And four things that are not types but govern how types behave:

| | |
|---|---|
| **Trunk** | the site; what every branch shares, stated once |
| **Sections** | branches; declare the media, style, format, voice and schema their leaves share |
| **Views** | the renderings an item appears in — full, teaser, card, feature, mention |
| **Schema** | one connected JSON-LD graph; the section declares the type, the view decides what is emitted |

Domain types — services, case studies, people, locations — are **out of scope
here**. They are built on this substrate later, and any of them that cannot be
expressed as a page plus components is a sign this layer is wrong.

### Lineage

This model is taken from [WordPress's default post
types](https://developer.wordpress.org/themes/classic-themes/basics/post-types/),
because that set has survived twenty years of every kind of site being built on it
and the vocabulary is already in everyone's head.

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
| `format` | string | **yes** | the shape of an item — `article`, `profile`, `record`, `listing` |
| `schema` | string | **yes** | the schema.org type its items are — see [Schema](#schema) |
| `voice` | string | no | named voice, or prose describing it; editorial guidance, not rendering |
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

**Voice is editorial, not technical.** It does not render. It exists so that
whoever writes the next item — a person, or a model — knows what the section
sounds like without reverse-engineering it from the items already in it. A section
whose voice cannot be stated in a sentence is probably two sections.

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

## Pages

Leaves. Hierarchical, arbitrary depth — a page that acquires children has become a
branch and declares for them, per [Inheritance](#inheritance).

Static: outside the dated stream, absent from feeds, and carrying no taxonomy. A
page is found by navigating to it, which is what the tree is for. Pages may have
dates, but nothing sorts or groups by them.

Structurally: a leaf is `index.md` in its own directory when it carries media, or a
plain `.md` file when it does not. The directory tree *is* the hierarchy — nothing
in front matter declares a parent, so the structure cannot disagree with itself.

| field | type | required | notes |
|---|---|---|---|
| `title` | string | **yes** | |
| `summary` | string | no | falls back to the rendered summary |
| `weight` | int | no | order among siblings; unset sorts last, then by title |
| `components` | list of paths | no | see [Components](#components) |
| `sideMenu` | bool | no | default `true`; `false` hides this page from the side menu without unpublishing it |
| `menu` | string | no | see [Menus](#menus) |

The hierarchy drives URL structure, breadcrumbs and the side menu. One tree, three
consumers — which is why the tree is the only place the relationship is stated.

A page with no children, no components and no media is the common case.

## Posts

Non-hierarchical. Flat, dated, and classified only by tags.

The dated stream: reverse-chronological, timestamped, and the only type that
appears in feeds. A post is found by recency or by subject, never by position —
there is no position.

A post never has children. If something needs a child, it is a page.

| field | type | required | notes |
|---|---|---|---|
| `title` | string | **yes** | |
| `date` | date | **yes** | |
| `tags` | list | no | **subjects** — see [Taxonomies](#taxonomies) |
| `summary` | string | no | |
| `components` | list of paths | no | |

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

Two menus, each derived from a different thing. Neither is hand-maintained as a
flat list of links.

**Top — sections.** The site's top-level sections. Order by `weight`. A section
appears here unless it opts out. This is the one menu that may also be declared in
config, for external links and for pages that must appear out of tree order.

**Side — parent and children.** Contextual to wherever the reader is: the current
branch of the page hierarchy, its siblings and its children. Present only on pages
that have a parent or children. Order by `weight`, then title.

Front matter control:

- `weight` orders within both
- `sideMenu = false` removes a page from the side menu but not from the site
- `menu = "top"` forces a non-section page into the top menu

Posts have no menu presence. They are reached through their section and their tags.

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

## Taxonomies

| taxonomy | applies to | means |
|---|---|---|
| `tags` | **posts only** | the *subjects* of a post |

Pages are classified by their position in the tree. They do not carry tags; a page
that wants to be found by subject is a post.

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

## Fixtures

Demo content exists to attack this model, not to flatter it. It must include:

- **Three of everything** — three sections, three pages, three posts, three tags.
- **Three sections that genuinely differ** in media, style, format and voice, so
  that inheritance is exercised rather than assumed. One requiring media, one
  forbidding it, one where it is optional — the third is the hard case, because it
  is the only one where the same view has to handle both.
- **Every declared view rendered at least once**, and a section that declares only
  `full`, so that the absence of `teaser` is proven to be an error rather than a
  silent fallback.
- **An item that appears in a `feature` view outside its own section**, which is
  where a section's style and its host page's style collide.
- **A hierarchy three deep**, so breadcrumbs and the side menu have something real
  to render, next to a top-level page with no children at all.
- **A branch inside a branch that overrides its parent**, and a leaf that overrides
  its branch — inheritance is only proven where something disagrees with its
  parent. A tree where every height agrees tests nothing.
- **A leaf that becomes a branch**, to prove that acquiring a child changes what a
  page is without anyone editing its front matter.
- **A tag used once beside a tag used forty times.**
- **A page with twelve images and one with none.**
- **An item with no summary in a section that supports `teaser`** — the case where
  a view has to invent something and will do it badly.
- **A component used on five pages and a component used on one.**
- **A page whose only content is components**, and one with no components at all.
- **A site with three pages and no posts** — day one of a client engagement, which
  every client passes through and most sites handle badly.

If the demo content contains only the cases we had in mind, the model will look
complete and will not be.
