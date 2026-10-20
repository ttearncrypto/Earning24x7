---
layout: post
title: "Old Car Parts Worth More Than Gold"
description: "Catalytic converters hold rhodium, platinum and palladium. Learn why they cost so much, how to remove them legally from an old car, and how to sell them."
image: "https://ttearncrypto.f9xr.org/Earning24x7/assets/post-images/car-parts-metals-worth-more-than-gold-sell-old-car.webp"
image_width: 1200
image_height: 630
image_caption: "Old car parts that hide rare metals worth more than gold"
date: 2026-10-21
author: "F9XR Review Board"
category: blogs
tags: [catalytic converter scrap value, rhodium price, platinum group metals, scrap car parts, sell old car, precious metal recycling, urban mining, e-waste, palladium, auto recycling]
faq:
  - q: "What car part has metals worth the most money?"
    a: "The catalytic converter. It contains platinum, palladium and rhodium, which are coated onto a ceramic or metal honeycomb to clean exhaust gases."
  - q: "Is rhodium really worth more than gold?"
    a: "Yes, at the time of writing. Reported August 2026 prices put rhodium at roughly $8,800 per troy ounce against about $4,530 for gold, so rhodium costs around twice as much per gram. Prices change daily."
  - q: "How much is an old catalytic converter worth?"
    a: "It depends on the vehicle, the engine type and the metal prices that day. Many converters sell for tens to a few hundred dollars, while some large or hybrid units fetch more. A grading or assay from the buyer gives the most accurate number."
  - q: "Is it legal to sell a catalytic converter from my old car?"
    a: "Usually yes, if you own the vehicle, the car is being scrapped or the part is being replaced, and you sell to a licensed buyer. Laws differ by country and state, so check local rules and keep proof of ownership."
  - q: "Can I extract platinum, palladium and rhodium myself?"
    a: "It's not recommended. The process uses hazardous chemicals, creates toxic waste and often needs a license. Selling the intact converter to a refiner is safer and usually more profitable for individuals."
---

Your old car is a pile of steel, rubber and regret. Tucked under the floor, behind a heat shield, sits a ceramic honeycomb coated with a few grams of metal that cost more per gram than almost anything you can buy at a jeweler. That part is the catalytic converter, and its scrap value is the single biggest reason a junkyard will pay you anything at all for a dead vehicle.

If you write code for a living, this should sound familiar. A small, boring component holds outsized value, and you have probably never cracked one open. This guide explains which car parts contain high value elements, why those elements cost so much, how to get them out of an old vehicle the legal way, and how to turn the whole thing into a small side income. We also include a short Python script so you can estimate payouts yourself instead of trusting a scrap yard's first quote.

> **A quick accuracy note before we start.** Rhodium and iridium really do beat gold on price per gram. Platinum and palladium usually do not. They are still "precious metals" by definition, and they matter because a car carries a tiny amount of the very expensive ones. We'll keep the claims honest throughout, the same way we [review and verify everything we publish]({{ '/pages/about.html' | relative_url }}).

## Which car parts hold precious metals?

The catalytic converter is the famous one. A modern car holds a surprising mix of metals worth money.

| Car part | Metals inside | Why it is there | Practical resale value |
|---|---|---|---|
| Catalytic converter | Platinum, palladium, rhodium | Converts toxic exhaust gases into CO2, nitrogen and water | High. Usually the best paying scrap part in the car |
| Oxygen (lambda) sensor | Platinum | Electrode in the sensor element | Low per unit, small grams |
| Spark plugs | Iridium, platinum | Long life electrode tips | Very low, tips are tiny |
| ECU and circuit boards | Gold, silver, palladium, copper, tantalum | Connectors, contacts, capacitors | Low to moderate, needs a refiner |
| Electric motors, speakers, some power steering units | Neodymium, dysprosium | Strong permanent magnets | Moderate, hard to recover |
| Hybrid and EV battery packs | Lithium, nickel, cobalt, manganese | Cell chemistry | Can be high, but needs certified handling |
| Wiring harness and radiator | Copper, aluminium | Conductivity and heat transfer | Steady, easy to sell by weight |

The takeaway is simple. The catalytic converter is the star, the electronics are a quiet second, and everything else is ordinary scrap metal pricing.

## Why are these elements so expensive?

Three forces push the price up: scarcity, hard to replace chemistry, and supply concentration.

### Supply sits in a handful of places

Platinum group metals (PGMs) are mined in very small volumes, and a large share of world supply comes from just a few regions, mainly South Africa and Russia. When a mine goes offline or trade rules change, prices jump.

### Nothing else does the job as well

Emission rules force carmakers to cut carbon monoxide, hydrocarbons and nitrogen oxides. Platinum, palladium and rhodium are the catalysts that make that possible at exhaust temperatures. Rhodium is especially good at breaking down nitrogen oxides, which is why it gets used even in tiny amounts.

### Recycled scrap is the main source

Used converters are a major feed for refiners. That's why the industry calls it urban mining. Recovering PGMs from scrap uses far less energy than digging new ore, and the [Johnson Matthey PGM market reports](https://matthey.com){:target="_blank" rel="noopener"} track that recycled supply every year.

### How the prices compare

Spot prices move daily, so treat these as a snapshot. Reported figures for August 2026 put rhodium near $8,800 per troy ounce, gold near $4,530, platinum near $1,900 and palladium near $1,350. Always check a live source such as [Umicore Precious Metals Management](https://pmm.umicore.com/en/prices/){:target="_blank" rel="noopener"}, the [LBMA](https://www.lbma.org.uk){:target="_blank" rel="noopener"} or your local refiner before you do any math.

| Metal | Approx. price per troy ounce (Aug 2026) | Approx. price per gram |
|---|---|---|
| Rhodium | $8,800 | $283 |
| Gold | $4,530 | $146 |
| Platinum | $1,900 | $61 |
| Palladium | $1,350 | $43 |

Per gram, rhodium is roughly double gold. That's the honest version of the "worth more than gold" headline.

## How much is a catalytic converter really worth?

A typical passenger car converter holds only a few grams of PGMs in total. The exact mix depends on the make, model, engine size and whether it is petrol, diesel or hybrid. Hybrids often carry more because their engines run cooler and need more catalyst loading to meet emission targets.

Here is an illustrative example with made up loading numbers, just to show the math:

- Platinum: 1.0 g
- Palladium: 2.0 g
- Rhodium: 0.3 g

Using the August 2026 prices above, the gross metal value is about $233. After refining losses and the buyer's margin, a seller might see around $155. Real quotes vary a lot, and some converters are worth far less or far more. The only way to know is to get the converter graded or assayed.

### A small Python calculator for developers

This script gives you a quick sanity check before you accept an offer. Swap in live prices and the loading figures your buyer provides.

```python
TROY_OZ_IN_GRAMS = 31.1035

def converter_payout(grams, prices_per_oz, recovery=0.95, payout_rate=0.70):
    """Return (gross_value, estimated_payout) in USD.

    grams: dict of metal -> grams contained
    prices_per_oz: dict of metal -> USD per troy ounce
    recovery: share of metal the refiner can actually recover
    payout_rate: share of recovered value the buyer passes to you
    """
    gross = sum(grams[m] * prices_per_oz[m] / TROY_OZ_IN_GRAMS for m in grams)
    return round(gross, 2), round(gross * recovery * payout_rate, 2)

prices = {"Pt": 1900, "Pd": 1350, "Rh": 8800}
grams = {"Pt": 1.0, "Pd": 2.0, "Rh": 0.3}

print(converter_payout(grams, prices))
# (232.8, 154.81)
```

To go further, wrap it in a small FastAPI endpoint, pull prices from a metals API, and store quotes in a table so you can compare buyers over time. It's a neat weekend project, and a useful one for anyone who flips scrap parts. If scrap metal is not your scene but you still want a developer friendly side income, our roundup of [five ways to earn money while searching the web]({{ '/2026/09/03/5-ways-to-earn-money-while-searching-the-web.html' | relative_url }}) is a lower friction place to start.

## How to get these parts from an old car (legally and safely)

A lot of articles get this part wrong. **Only remove parts from a vehicle you own, or have written permission to dismantle.** Catalytic converter theft is a serious crime in many countries, and reputable buyers ask for proof of ownership before they hand over cash.

### Step 1: Confirm you own the car and can scrap it

Keep the registration papers, ID and any deregistration or scrappage certificate. In India, end of life vehicles should go through a registered vehicle scrapping facility under the national scrappage policy, which you can check on [Parivahan, the government transport portal](https://parivahan.gov.in){:target="_blank" rel="noopener"}. In the US and UK, check local rules for licensed dismantlers and scrap metal dealers, and review the [US EPA guidance on emission control devices](https://www.epa.gov){:target="_blank" rel="noopener"}.

### Step 2: Remove the converter safely

- Let the exhaust cool completely. It gets extremely hot.
- Use a jack and proper jack stands. Never work under a car held up by a jack alone.
- Soak rusted bolts with penetrating oil, then cut with a reciprocating saw or remove the flanges.
- Wear gloves, eye protection and a dust mask. Old ceramic material is a dust hazard.
- Keep the converter intact. Don't break it open.

### Step 3: Record identifying details

Photograph the converter, note the stamped part numbers and write down the vehicle make, model and year. Buyers use these numbers to look up the likely PGM loading.

### Step 4: Pull the electronics and sensors

The ECU, oxygen sensors and wiring harness can be removed with basic hand tools. Disconnect the battery first. Sell electronics to an e-waste recycler rather than trying to extract gold at home.

### Step 5: Do not try home chemical extraction

Recovering PGMs or gold with acids is dangerous, produces toxic waste and is illegal in many places without a license. The smart money is in selling the intact part to a refiner or licensed recycler. Leave the chemistry to a licensed lab.

## How to sell an old car's catalytic converter and earn from it

### Where to sell

- **Licensed scrap yards and auto recyclers:** fast and convenient, but quotes vary a lot.
- **Direct to refiners or catalytic converter buyers:** often a better rate if you bring several units.
- **Online marketplaces for used parts:** good for intact, working parts like ECUs.
- **E-waste recyclers:** best for circuit boards and sensors.

### How to get a better price

1. **Get at least three quotes.** Offers differ by a surprising margin.
2. **Ask how they price.** Good buyers quote by part number or assay, not a flat guess.
3. **Don't clean or damage the converter.** Keep the original casing and stamps.
4. **Check the live metal price** on the day you sell. Rhodium and palladium can move quickly.
5. **Keep paperwork.** Receipts protect you if anyone questions the sale later.
6. **Sell by the right unit.** Some buyers pay per piece, others by weight after grading.

### Turning it into a small business

If you plan to do this repeatedly, register as a scrap dealer or work through a licensed partner, keep a transaction log, and pay taxes on your earnings. For developers, a simple spreadsheet or small database that tracks part numbers, buyer quotes and final payouts goes a long way. It's also a good way to show buyers that you run a clean, traceable operation.

## Risks and mistakes to avoid

- Selling or buying without paperwork. This is how honest people end up in legal trouble.
- Trusting the first offer. Compare at least three.
- Ignoring emissions law. It's illegal in many regions to pull a converter from a car that stays on the road, and the car can fail inspections.
- Mishandling hybrid or EV batteries. High voltage packs can injure or kill. Leave them to certified technicians.
- Chasing small items. Spark plug tips and tiny sensors rarely cover the time spent.

## Key takeaways

- The catalytic converter is the highest value scrap part in most petrol and diesel cars because it contains platinum, palladium and rhodium.
- Rhodium and iridium beat gold on price per gram. Platinum and palladium do not, but they still sell for good money and get recycled heavily.
- A typical converter holds only a few grams of PGMs, so payouts depend on the part number, the live metal price and the buyer's margin.
- ECUs, sensors, magnets and batteries add extra value, but each needs the right recycler.
- Always prove ownership, work safely and sell to licensed buyers.
- Never try to extract metals with chemicals at home.

## Conclusion

An old car is worth more than its weight in steel once you know where the platinum group metals are hiding. The converter comes first, the electronics second, and honest paperwork makes the whole transaction smooth. Get the part graded, check the live price on the day, take three quotes, and sell to a licensed buyer. Do that consistently and a scrapped vehicle turns into a small, repeatable income stream instead of a one off favor for your local junkyard.

*This article is for general information only. Metal prices change constantly, and laws on dismantling vehicles and selling scrap differ by country and region. Confirm local regulations and use licensed buyers before you sell.*

*Produced with AI-assisted research and drafting, reviewed and edited by the F9XR Review Board. See our [About page]({{ '/pages/about.html' | relative_url }}) for how we create and verify content.*
