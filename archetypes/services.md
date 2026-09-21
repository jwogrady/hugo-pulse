+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
summary = ''

# schema.org Service.serviceType
serviceType = ''

# Omit price entirely for "call us" pricing. A service with no price is the
# common case, not the degraded one.
# priceRange = ''
# bookingUrl = ''

service-categories = []
service-areas = []

weight = 100
+++
