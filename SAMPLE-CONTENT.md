# About this demo content

Everything under `content/` is **sample content for the Pulse theme**. It exists to
demonstrate the content model and to be screenshotted, not to be reused.

## Meridian Field Services does not exist

There is no such company. The people, the jobs, the prices, the accreditations and
the history are all invented. Telephone numbers use the 555 reservation.

County names are real — Crawford, Vernon, Grant and the rest are the actual
Driftless counties — because a service-area fixture is worthless if the areas are
not plausible. That is the only part taken from the world.

## There is no invented proof here, on purpose

The demo contains **no testimonials, no case studies, no ratings and no review
counts.**

Pulse's model includes types whose purpose is customer-verified proof. A
testimonial written by whoever built the theme is a fabricated review with a
neutral filename on it, and it would be indistinguishable from a real one the
moment someone copied this directory into a client site.

The business shown here has none of those things, which is also the cold-start case
the model is designed around: what a site looks like on the day its owner has
nothing to show yet. That is the honest version and the useful one.

## Why every page carries its own flag

Each file here declares `sampleContent = true` for itself. There is no site-level
version of that flag, on purpose.

A site-level flag would be inherited the moment someone copied the config to start
a client site, and would silently switch off the revision check for every document
that client ever wrote — including ones authored months later that have nothing to
do with this demo. A flag that defeats itself when the directory is copied is no
protection at all, since being copied is precisely what this directory is for.

Page-level is verbose and fails in the right direction. Copy these pages and you
get flagged pages you can see in a diff. Write your own page and it is checked from
the first save, whatever you inherited.

## If you are starting a client site from this

Do not copy `content/`. Copy the *shape* — the section declarations, the type
references, the front matter contracts — and write the client's own material into
it. Nothing in here should survive into a real site.
