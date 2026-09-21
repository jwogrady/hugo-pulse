# What this buys you

Every convention in Pulse exists for a reason a business owner should care about.
This is that list, in those terms.

Numbers marked **measured** were taken from this repository. Everything in
[Not built yet](#not-built-yet) is specified and does not work today — it is
separated out deliberately, because a document claiming capabilities a product
does not have is a sales pitch, not documentation.

## The short version

| | measured |
|---|---|
| Stylesheet | **11,192 bytes** (2,882 gzipped) |
| JavaScript | **694 bytes** (465 gzipped) |
| A service page | **3,617 bytes** of HTML (1,823 gzipped) |
| Third-party requests blocking first paint | **zero** |
| Web fonts downloaded | **zero** |
| Full site build, 76 pages | **0.18 seconds** |

For comparison, a typical WordPress service site ships 1–3 MB before it shows
anything, most of it a theme framework and web fonts nobody chose.

## Loading fast

**Nothing blocks the page from appearing.** No font files, no framework, no
third-party scripts. The entire design is 11 KB of CSS and under 1 KB of
JavaScript, which arrive with the page rather than after it.

That matters in three places an owner can see:

- **Google grades it.** Largest Contentful Paint and Cumulative Layout Shift are
  ranking inputs. A page with no web fonts has nothing to reflow when a font
  finally loads, so the layout does not jump.
- **Google Ads grades it too.** Landing page experience is a Quality Score
  component, and Quality Score sets what you pay per click. A faster landing page
  costs less for the same ad position — the saving is on every click, forever, not
  once.
- **People leave slow pages.** Someone with water coming through a ceiling is on a
  phone, on rural signal, and will not wait.

**Text appears immediately** because the type is the system font already on the
reader's device. No download, no invisible text, no flash of the wrong font.

**Assets are fingerprinted.** Every stylesheet filename contains a hash of its own
contents, so it can be cached for a year and still never serve a stale version —
a change produces a new filename. Repeat visitors download the HTML and nothing
else. Files also carry integrity hashes, so a tampered asset is refused by the
browser rather than executed.

## Getting found

**Staging copies cannot be indexed.** Preview and branch builds emit
`Disallow: /` and serve `X-Robots-Tag: noindex` headers. Without that, a staging
copy of a site competes with the real site for its own search terms, and the
duplicate sometimes wins.

**Dates never depend on which machine built the site.** The timezone is pinned in
config. Unpinned, the same commit renders different times on a laptop and in CI —
and a wrong date in structured data is a wrong date in the search result.

**Taxonomy uses the words customers use.** A category exists only if a customer
would say it. The clearest demonstration is the rule deleting something: this site
had a `Scheduled` service category until it was tested against that rule. **Nobody
searches "scheduled plumber."** It was internal vocabulary wearing a
customer-facing costume, and it is gone.

What survives are phrases people actually type — *emergency*, *commercial*,
*residential*, and the county names. Those are the pages that can rank, because
they are the words that get searched.

**Pages are indexed by default.** Until a business has a brand, a first customer
and a running operation, direct traffic is almost useless — discovery is the only
channel there is. Withholding pages until they "earn" indexing is advice for a
site that already has an audience.

**The site never generates pages nobody searched for.** Nine service areas times
three services is twenty-seven pages that differ only by a place name. That is the
most common way a local service site gets penalised, and it is always built with
good intentions. Pulse refuses to generate them. A combination page exists when
someone has written something true about that combination.

## Converting the traffic

**Every page has a next action.** A page that finds the right reader, names their
problem and then offers them nothing has spent all its work and banked none of it.
The action is declared once per section and inherited, so a page cannot quietly
ship without one.

**The action still works when the vendor does not.** Booking points at whatever
system the business uses — Housecall Pro, Calendly, anything. If that fails to
load, the phone number is still on the page. A reader does not distinguish between
your site being broken and your booking provider being down.

**Changing vendors is a config line.** No booking company's name appears anywhere
in the templates, so switching does not mean rebuilding or re-authoring anything.

**Prices are on the page where a price exists.** "Competitive pricing" converts
worse than "$165 a visit, $290 for both", and the second is also what structured
data needs.

## Not built yet

Specified in `CONTENT-MODEL.md`, not working today. Listed so nobody quotes them
as features:

| | status |
|---|---|
| Image processing — resize, WebP, responsive sizes | **not built.** Images are served as uploaded |
| Structured data (JSON-LD) on every page | **not built.** Zero pages emit any today |
| The document revision check | specified, mechanism proven, check not written |
| Heading-level and contrast checks | not built |
| Enforcement of the vocabulary and action rules | documented, not enforced |
| Rendering driven by type declarations | `data/types/*.toml` exists and nothing reads it |

Image processing is the largest single win still outstanding. In a sibling repo
where it is implemented, one photograph went from 1,784,655 bytes to 36,616 — a
48× reduction on a single file. Pulse specifies the same treatment and does not
yet perform it.

## The honest summary

What works today is the **delivery**: a site that is small, fast, cacheable,
correctly excluded from indexing where it should be, and built on vocabulary
customers actually use.

What does not work yet is most of the **governance**: the checks that would stop a
page shipping without a next action, without structured data, or without an
unprocessed image bloating it.

The first half is why a page loads fast. The second half is why it keeps doing so
after fifty more pages have been added by someone in a hurry.
