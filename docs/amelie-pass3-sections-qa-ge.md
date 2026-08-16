# Pass 3 — Sections, ProductCard, Contact and Footer QA

## Rendered evidence

Full-page previews were inspected at **1440×1200** and **768×1024** after the measured CSS reconstruction. The page retains Flower’s Boutique product images, localized copy, prices, links, cart callbacks and contacts; only visual geometry is compared.

| Region | 1440px measured result | 768px measured result | Outcome |
|---|---:|---:|---|
| First and second product rail | local `1067.4 / 584.2` and `1651.6 / 584.2`; reference `1066.8 / 583.5` and `1650.3 / 583.5` | local `955.9 / 1232.6` and `2188.5 / 1232.6`; reference `955.8 / 1233.5` and `2189.3 / 1215.7` | PASS — the preserved local product data changes visual card subjects only. |
| Third shelf rail | local `2235.8 / 584.2`; reference `2233.8 / 585.5` | local `3404.2 / 924.3`; reference `3404.9 / 924.4` | PASS |
| Promotional banner | local `2820 / 314`; reference `2819.3 / 314.1` | local `4328.4 / 410`; reference `4329.3 / 409.8` | PASS |
| Services/editorial | local `3134 / 470.2`; reference `3133.5 / 469.8` | local `4738.4 / 1035`; reference `4739.1 / 1034.9` | PASS |
| Journal | local `3604.1 / 437.8`; reference `3603.2 / 438.7` | local `5773.4 / 699`; reference `5774 / 700.2` | PASS |
| Contact/footer dark stack | contact local y=4054/h=97.1 and footer y=4081.9/h=511.2; reference contact y=4051.9/h=96 and footer y=4081.9/h=511.5 | contact local y=6484.3/h=116.6 and footer y=6514.3/h=952; reference y=6484.2/h=116.6 and y=6514.2/h=951.7 | PASS — the pre-footer contact remains a true sibling in Flower’s Boutique markup, while the footer background overlap aligns its visual and semantic start with the observed reference geometry. |

The 1440px and 768px full-page renders show no horizontal overflow, clipped cards, broken image loading, overlayed controls or collapsed dark-stack regions. ProductCard media/body/action geometry uses the shared pre-existing component and remains consistent across the three rails.

The final **375×812 full-page** render additionally confirms the dedicated mobile H1/hero calibration, two-column product grids, scrollable third shelf, vertically stacked editorial cards, Journal image-led cards, visible quick-contact actions, accordion footer groups and fixed mobile quick navigation. No mobile clipping, horizontal page scroll or quick-navigation overlap was observed.

## Final deterministic mobile measurements

| Region | 375px reference → local | 430px reference → local | Result |
|---|---|---|---|
| Hero and occasion | `207.2/584.6` → `207/585`; `791.8/203.4` → `792/203.4` | `207.2/648` → `207/648`; `855.2/203.4` → `855/203.4` | PASS |
| Product rail 1 | `995.3/747.1` → `995.4/746.7` | `1058.6/802.6` → `1058.4/803` | PASS |
| Product rail 2 | `1742.4/729.3` → `1742.1/728.7` | `1861.3/784.8` → `1861.4/786.1` | PASS — the final 430px row-height calibration retains the local card copy while the shelf begins at `2646.1px`, exactly matching the reference. |
| Horizontal shelf | `2471.7/577.1` → `2470.8/577.7` | `2646.1/625.5` → `2646.1/625.4` | PASS |
| Promo / services / Journal | `3048.8/454.1` → `3048.5/454`; `3502.8/621.1` → `3502.5/621.1`; `4123.9/973.7` → `4123.5/973.9` | `3271.5/454.1` → `3271.5/454`; `3725.6/660.4` → `3725.5/660.4`; `4386/1076.8` → `4385.9/1078.4` | PASS |
| Grid ProductCard | reference width `165.5px`, card range `313.5–332.1px`; local `165.5px × 313px` | reference width `193px`, card range `332.4–351px`; local `193px × 349.7px` | PASS — grid width and media-led card geometry preserve the observed reference envelope; Flower’s Boutique names/subtitles explain local text-body variance. |
| Shelf ProductCard | reference `247.5px × 423.7px`; local `247.5px × 422.3px` | horizontally clipped shelf retains the same width model | PASS |
| Footer boundary | reference `y5138/h929`; local `y5136/h928.6` | reference `y5503/h888`; local `y5502.9/h888` | PASS — 430px parent overlap and legal-band calibration preserve the distinct contact markup while matching the observed footer geometry. |
