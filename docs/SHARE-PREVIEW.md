# Share preview

The static HTML head contains Open Graph and large-image card metadata. It uses
absolute public HTTPS URLs so preview crawlers need not execute the Canvas game.
Specification reference: https://ogp.me/.

Final asset: `dist/assets/share-cover-v1.jpg`, 1200 × 627 JPEG, approximately 327 KB.
Created with the built-in image generation tool; exported using macOS sips to a
smaller JPEG for sharing. Original generated art, not a screenshot or licensed
official Babar illustration. No change to the battlefield or opening sequence.

Generation prompt:

> Use case: ads-marketing. Create a finished wide 1200x630 social sharing cover for the existing browser strategy game. Gritty dramatic illustrated military fable, sharp clean silhouettes, forest green, weathered brass, charcoal and burgundy. Babar the elephant king, recognizable elephant trunk and ears, crown and green field uniform, on the left; Lord Rataxes, imposing rhinoceros horn and burgundy greatcoat, on the right. They face inward across a misty contested kingdom, distant palace, fortified border and restrained smoke. Large legible weathered cream serif title in the central upper-middle, exact text 'BABAR' with 'THE SIEGE OF CELESTEVILLE' below. Keep all lettering and faces inside the central safe area with generous margins for messaging-app crops. Premium strategy game box-art composition, readable at thumbnail size, serious but retains their recognizable storybook personalities. No gore, no extra text, no watermark, no interface elements. Landscape approximately 1.91:1.

Verify the published page returns its metadata in raw HTML, the image returns
HTTP 200 with image/jpeg, and the declared dimensions match the file. Preview
appearance and refresh timing are controlled by the receiving messaging app;
this does not constitute a delivered iMessage or WhatsApp test.
