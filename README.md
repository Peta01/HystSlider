# Hyst Slider Card (HACS)

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
- `unit` (volitelne): jednotka, default z entity nebo `°C`
- `accent_color` (volitelne): barva aktivni casti slideru
- `set_service` (volitelne): vlastni service ve formatu `domain.service` (pouze Number rezim)

## Doporuceni pro helpery

Pro jednoduchy start si vytvor dva helpery typu Number:

- `input_number.temp_min`
- `input_number.temp_max`

Pak je pouzij v konfiguraci karty.