# Customer copy review

Genaan's customer copy uses simple English for business owners in Egypt, with Arabic equivalents through the existing language switch. English remains the default for new visitors; a saved language choice is respected.

Updated the home and package content, contact form, plant gallery, about page, FAQ, privacy page, account copy, authentication pages and customer error screens. Catalogue descriptions now distinguish the five packages, with a separate custom package. The reviewed catalogue copy is recorded in `database/commercial-copy-refresh.sql`; prices, plant counts, images and business settings are retained.

The care page now explains the current annual service instead of the former shop guides and consultation form. It reads care prices from business settings and describes two visits per year at six-month intervals or four at three-month intervals. Quote requests remain the shared enquiry flow. The FAQ explains the callback after submission, rather than the former WhatsApp draft flow.

Removed promotional claims from the previous shop, including free delivery and a 30-day guarantee. Removed typographic dashes in visible customer copy and decorative dividers between package details. Simplified labels and localised enquiry errors. Logo and brand colours are retained.

Validation: TypeScript and production build passed. Rendered thirteen customer views in both languages and checked visible copy for mixed Arabic in English, untranslated Arabic views, obsolete promises and typographic dashes. Confirmed the selected package and three care options render in both languages. These checks cover content rendering; they do not constitute interactive browser or visual layout testing. Legacy password recovery implementation was not changed by this editorial update.
