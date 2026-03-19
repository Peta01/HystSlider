# Hyst Slider Card

Dual-thumb Lovelace karta pro Home Assistant, ktera na jedne ose nastavuje dve hodnoty: minimum a maximum teploty.

![Hyst Slider Card preview](https://raw.githubusercontent.com/Peta01/HystSlider/main/assets/preview.svg)

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
accent_color: "#ff7a18"
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
- Pro HACS update workflow je publikovany release tag `v0.1.0`.

## Repo

- GitHub: `https://github.com/Peta01/HystSlider`
- Release: `https://github.com/Peta01/HystSlider/releases/tag/v0.1.0`# Hyst Slider Card (HACS)

Lovelace custom karta pro Home Assistant s dvojitym sliderem (2 palce) na jedne ose.

Pouziti: nastaveni minimalni a maximalni teploty (hystereze) pro:

- dve cisla (`input_number` nebo `number`)
- jednu `climate` entitu (`target_temp_low` + `target_temp_high`)

## Co umi

- Dva palce: `Min` a `Max`
- Odesila hodnoty do Home Assistant pres `set_value`
- Podpora climate rozsahu pres `climate.set_temperature`
- Bere rozsah a krok z entity atributu (`min`, `max`, `step`) nebo z konfigurace karty
- Funguje i s vlastnim servisem pres `set_service`
- Mushroom-like vzhled: ikona, subtitle, jemna animace a gradientni karta

## Instalace pres HACS

1. Nahraj repozitar do vlastniho GitHub repozitare.
2. V HACS pridej **Custom repository** typu **Dashboard**.
3. Nainstaluj `Hyst Slider Card`.
4. Restartuj Home Assistant.
5. Pridej zdroj (pokud se nepridal automaticky):

```yaml
url: /hacsfiles/HystSlider/hyst-slider-card.js
type: module
```

Poznamka: cast cesty `HystSlider` musi odpovidat nazvu tveho repozitare.

## Priklad konfigurace karty

### Varianta A: dve cisla (`input_number`/`number`)

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
accent_color: "#ff7a18"
```

### Varianta B: jedna climate entita

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

## Podporovane parametry

- `type` (povinne): `custom:hyst-slider-card`
- `min_entity` + `max_entity` (povinne pro Number rezim): entity pro min/max hodnotu
- `climate_entity` (povinne pro Climate rezim): climate entita s low/high target teplotou
- `title` (volitelne): nadpis karty, default `Teplotni rozsah`
- `subtitle` (volitelne): sekundarni text pod nadpisem
- `icon` (volitelne): MDI ikona vlevo v headeru
- `min_label` (volitelne): popisek leve hodnoty, default `Min`
- `max_label` (volitelne): popisek prave hodnoty, default `Max`
- `min` (volitelne): minimum slideru
- `max` (volitelne): maximum slideru
- `step` (volitelne): krok slideru
- `decimals` (volitelne): pocet desetinnych mist pro zobrazeni, default `0`
- `unit` (volitelne): jednotka, default z entity nebo `°C`
- `accent_color` (volitelne): barva aktivni casti slideru
- `set_service` (volitelne): vlastni service ve formatu `domain.service` (pouze Number rezim)

## Doporuceni pro helpery

Pro jednoduchy start si vytvor dva helpery typu Number:

- `input_number.temp_min`
- `input_number.temp_max`

Pak je pouzij v konfiguraci karty.