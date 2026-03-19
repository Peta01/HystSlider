# Hyst Slider Card

Dual-thumb Lovelace karta pro Home Assistant, ktera na jedne ose nastavuje dve hodnoty: minimum a maximum teploty.

![Hyst Slider Card preview](assets/preview.png)

Pouziti:

- hysterese topeni nebo chlazeni
- nastavovani min/max teploty pres `input_number` nebo `number`
- ovladani `climate` entity s `target_temp_low` a `target_temp_high`

## Co umi

- dva palce na jedne ose: `Min` a `Max`
- Number rezim pro `input_number` a `number`
- Climate rezim pro `climate.set_temperature`
- Mushroom-like vzhled s ikonou, subtitle a zvyraznenym rozsahem
- konfigurovatelny `step`, `decimals`, `accent_color`, `icon`, `subtitle`
- automaticke cteni `min`, `max`, `step` a jednotek z atributu entity

## Instalace pres HACS

1. V HACS otevri `Custom repositories`.
2. Pridej repozitar `https://github.com/Peta01/HystSlider`.
3. Typ nastav na `Dashboard`.
4. Nainstaluj `Hyst Slider Card`.
5. Restartuj Home Assistant.
6. Pokud se resource neprida automaticky, pridej:

```yaml
url: /hacsfiles/HystSlider/hyst-slider-card.js
type: module
```

Poznamka: cast `HystSlider` v URL musi odpovidat nazvu GitHub repozitare.

## Rychly start

### Varianta A: dve helper entity

```yaml
type: custom:hyst-slider-card
title: Teplotni hystereze
subtitle: Kotel - rozsah
icon: mdi:radiator
min_entity: input_number.temp_min
max_entity: input_number.temp_max
min: 15
max: 30
step: 0.5
decimals: 0
unit: "°C"
min_label: Min
max_label: Max
accent_color: "#ce6b45"
```

### Varianta B: climate entita

```yaml
type: custom:hyst-slider-card
title: Klima loznice
icon: mdi:thermostat-box
climate_entity: climate.loznice
min: 17
max: 27
step: 0.5
decimals: 0
accent_color: "#f28b30"
```

V climate rezimu karta vola:

- service: `climate.set_temperature`
- data: `target_temp_low` a `target_temp_high`

## Konfigurace

- `type`: `custom:hyst-slider-card`
- `min_entity` + `max_entity`: povinne pro Number rezim
- `climate_entity`: povinne pro Climate rezim
- `title`: nadpis karty, default `Teplotni rozsah`
- `subtitle`: sekundarni text pod nadpisem
- `icon`: MDI ikona vlevo v headeru
- `min_label`: popisek leve hodnoty, default `Min`
- `max_label`: popisek prave hodnoty, default `Max`
- `min`: minimum slideru
- `max`: maximum slideru
- `step`: krok slideru
- `decimals`: pocet desetinnych mist pro zobrazeni, default `0`
- `unit`: jednotka, default z entity nebo `°C`
- `accent_color`: barva aktivni casti slideru
- `set_service`: vlastni service ve formatu `domain.service` pro Number rezim

## Doporuceny setup helperu

Pro jednoduchy start si vytvor dva helpery typu Number:

- `input_number.temp_min`
- `input_number.temp_max`

Pak je pripoj do karty jako `min_entity` a `max_entity`.

## Poznamky

- `decimals` ovlivnuje zobrazeni, ne vnitrni hodnotu odesilanou do Home Assistant.
- Pokud se karta po instalaci nezobrazi, udelej hard refresh prohlizece a zkontroluj resource URL.
- Pro HACS update workflow je publikovany release tag `v0.1.3`.

## DEV test vedle stable

Pokud chces testovat novy branch bez rizika pro funkcni verzi, pouzij oddelenou dev kartu.

Tento repozitar obsahuje:

- stable soubor: `hyst-slider-card.js` s typem `custom:hyst-slider-card`
- dev soubor: `hyst-slider-card-dev.js` s typem `custom:hyst-slider-card-dev`

Postup v Home Assistant:

1. Ponech stable resource beze zmen.
2. Pridej druhy resource pro dev build:

```yaml
url: /local/hyst-slider-card-dev.js?v=1
type: module
```

3. Nahraj `hyst-slider-card-dev.js` do `config/www/`.
4. Vytvor test dashboard kartu s typem `custom:hyst-slider-card-dev`.
5. Produkcni dashboard nech na `custom:hyst-slider-card`.

Pri kazde zmene dev souboru zvys query parametr, napr. `?v=2`, aby se obesla cache prohlizece.

## Repo

- GitHub: `https://github.com/Peta01/HystSlider`
- Release: `https://github.com/Peta01/HystSlider/releases/tag/v0.1.3`