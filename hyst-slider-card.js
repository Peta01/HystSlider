class HystSliderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._elements = {};
  }

  setConfig(config) {
    const hasPair = Boolean(config?.min_entity && config?.max_entity);
    const hasClimate = Boolean(config?.climate_entity);

    if (!config || (!hasPair && !hasClimate)) {
      throw new Error(
        "Configuration requires either min_entity + max_entity or climate_entity."
      );
    }

    this._config = {
      title: "Teplotni rozsah",
      subtitle: "",
      icon: "mdi:thermometer-lines",
      min_label: "Min",
      max_label: "Max",
      min: null,
      max: null,
      step: null,
      unit: null,
      accent_color: null,
      ...config,
    };

    this._buildCard();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 2;
  }

  _buildCard() {
    if (!this.shadowRoot || !this._config) {
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        ha-card {
          position: relative;
          overflow: hidden;
          padding: 16px;
          border-radius: 20px;
          box-shadow: var(--ha-card-box-shadow, none);
          background:
            radial-gradient(circle at top right, rgba(255, 147, 77, 0.16), transparent 46%),
            radial-gradient(circle at bottom left, rgba(61, 140, 244, 0.08), transparent 45%),
            linear-gradient(160deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0));
          animation: card-enter 220ms ease-out;
        }

        @keyframes card-enter {
          from {
            transform: translateY(6px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .top-gloss {
          position: absolute;
          inset: 0 0 auto 0;
          height: 44%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
          pointer-events: none;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          color: var(--hyst-slider-accent, var(--state-climate-heat-color, var(--primary-color)));
        }

        .icon-wrap ha-icon {
          width: 19px;
          height: 19px;
        }

        .text-wrap {
          min-width: 0;
        }

        .title {
          margin: 0;
          font-size: 0.98rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subtitle {
          margin-top: 2px;
          font-size: 0.78rem;
          opacity: 0.72;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .value-row {
          display: flex;
          gap: 8px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 70px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.86rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.08);
          color: var(--primary-text-color);
          position: relative;
          z-index: 1;
        }

        .slider-wrap {
          position: relative;
          padding-top: 8px;
          height: 40px;
          display: flex;
          align-items: center;
          z-index: 1;
        }

        .track {
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          border-radius: 99px;
          background: var(--divider-color);
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          margin: 0;
          height: 8px;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          height: 8px;
          background: transparent;
        }

        input[type="range"]::-moz-range-track {
          height: 8px;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: all;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.95);
          background: var(--hyst-slider-accent, var(--primary-color));
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          margin-top: -7px;
          transition: transform 120ms ease;
        }

        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.08);
        }

        input[type="range"]::-moz-range-thumb {
          pointer-events: all;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.95);
          background: var(--hyst-slider-accent, var(--primary-color));
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          transition: transform 120ms ease;
        }

        .limit-row {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 0.75rem;
          opacity: 0.72;
          position: relative;
          z-index: 1;
        }
      </style>
      <ha-card>
        <div class="top-gloss"></div>
        <div class="header">
          <div class="header-left">
            <span class="icon-wrap"><ha-icon id="card-icon"></ha-icon></span>
            <div class="text-wrap">
              <h3 class="title"></h3>
              <div class="subtitle" id="subtitle"></div>
            </div>
          </div>
          <div class="value-row">
            <span class="pill" id="min-value">-</span>
            <span class="pill" id="max-value">-</span>
          </div>
        </div>
        <div class="slider-wrap">
          <div class="track" id="track"></div>
          <input id="min-slider" type="range" />
          <input id="max-slider" type="range" />
        </div>
        <div class="limit-row">
          <span id="left-limit"></span>
          <span id="right-limit"></span>
        </div>
      </ha-card>
    `;

    this._elements = {
      title: this.shadowRoot.querySelector(".title"),
      subtitle: this.shadowRoot.getElementById("subtitle"),
      icon: this.shadowRoot.getElementById("card-icon"),
      track: this.shadowRoot.getElementById("track"),
      minSlider: this.shadowRoot.getElementById("min-slider"),
      maxSlider: this.shadowRoot.getElementById("max-slider"),
      minValue: this.shadowRoot.getElementById("min-value"),
      maxValue: this.shadowRoot.getElementById("max-value"),
      leftLimit: this.shadowRoot.getElementById("left-limit"),
      rightLimit: this.shadowRoot.getElementById("right-limit"),
    };

    this._elements.minSlider.addEventListener("input", () => this._onInput("min"));
    this._elements.maxSlider.addEventListener("input", () => this._onInput("max"));
    this._elements.minSlider.addEventListener("change", () => this._commit("min"));
    this._elements.maxSlider.addEventListener("change", () => this._commit("max"));
  }

  _getEntity(entityId) {
    if (!this._hass || !entityId) {
      return null;
    }
    return this._hass.states[entityId] || null;
  }

  _numState(entity, fallback) {
    const raw = entity?.state;
    const value = Number(raw);
    if (Number.isFinite(value)) {
      return value;
    }
    return fallback;
  }

  _resolveMeta(minEntity, maxEntity) {
    if (this._isClimateMode()) {
      const climateEntity = this._getEntity(this._config.climate_entity);
      const climateAttr = climateEntity?.attributes || {};

      const sliderMin = Number.isFinite(this._config.min)
        ? this._config.min
        : Number.isFinite(Number(climateAttr.min_temp))
          ? Number(climateAttr.min_temp)
          : 5;

      const sliderMax = Number.isFinite(this._config.max)
        ? this._config.max
        : Number.isFinite(Number(climateAttr.max_temp))
          ? Number(climateAttr.max_temp)
          : 35;

      const sliderStep = Number.isFinite(this._config.step)
        ? this._config.step
        : Number.isFinite(Number(climateAttr.target_temp_step))
          ? Number(climateAttr.target_temp_step)
          : 0.5;

      const unit =
        this._config.unit ||
        climateAttr.temperature_unit ||
        this._hass?.config?.unit_system?.temperature ||
        "°C";

      return { sliderMin, sliderMax, sliderStep, unit };
    }

    const minAttr = minEntity?.attributes || {};
    const maxAttr = maxEntity?.attributes || {};

    const sliderMin = Number.isFinite(this._config.min)
      ? this._config.min
      : Number.isFinite(Number(minAttr.min))
        ? Number(minAttr.min)
        : Number.isFinite(Number(maxAttr.min))
          ? Number(maxAttr.min)
          : 0;

    const sliderMax = Number.isFinite(this._config.max)
      ? this._config.max
      : Number.isFinite(Number(minAttr.max))
        ? Number(minAttr.max)
        : Number.isFinite(Number(maxAttr.max))
          ? Number(maxAttr.max)
          : 50;

    const sliderStep = Number.isFinite(this._config.step)
      ? this._config.step
      : Number.isFinite(Number(minAttr.step))
        ? Number(minAttr.step)
        : Number.isFinite(Number(maxAttr.step))
          ? Number(maxAttr.step)
          : 0.5;

    const unit =
      this._config.unit ||
      minAttr.unit_of_measurement ||
      maxAttr.unit_of_measurement ||
      "°C";

    return { sliderMin, sliderMax, sliderStep, unit };
  }

  _clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  _isClimateMode() {
    return Boolean(this._config?.climate_entity);
  }

  _format(value, unit) {
    return `${Number(value).toFixed(1)} ${unit}`;
  }

  _resolveClimateValues(sliderMin, sliderMax) {
    const climate = this._getEntity(this._config.climate_entity);
    const attrs = climate?.attributes || {};
    const step = Number.isFinite(Number(attrs.target_temp_step))
      ? Number(attrs.target_temp_step)
      : 0.5;

    let minVal = Number.isFinite(Number(attrs.target_temp_low))
      ? Number(attrs.target_temp_low)
      : Number.isFinite(Number(attrs.temperature))
        ? Number(attrs.temperature) - step
        : sliderMin;

    let maxVal = Number.isFinite(Number(attrs.target_temp_high))
      ? Number(attrs.target_temp_high)
      : Number.isFinite(Number(attrs.temperature))
        ? Number(attrs.temperature) + step
        : sliderMax;

    minVal = this._clamp(minVal, sliderMin, sliderMax);
    maxVal = this._clamp(maxVal, sliderMin, sliderMax);

    if (minVal > maxVal) {
      const temp = minVal;
      minVal = maxVal;
      maxVal = temp;
    }

    return { minVal, maxVal, entity: climate };
  }

  _renderTrack(minVal, maxVal, sliderMin, sliderMax) {
    const span = sliderMax - sliderMin;
    const minPct = ((minVal - sliderMin) / span) * 100;
    const maxPct = ((maxVal - sliderMin) / span) * 100;

    this._elements.track.style.background = `linear-gradient(
      to right,
      var(--divider-color) 0% ${minPct}%,
      var(--hyst-slider-accent, var(--primary-color)) ${minPct}% ${maxPct}%,
      var(--divider-color) ${maxPct}% 100%
    )`;
  }

  _onInput(type) {
    if (!this._elements.minSlider || !this._elements.maxSlider) {
      return;
    }

    const minSlider = this._elements.minSlider;
    const maxSlider = this._elements.maxSlider;
    const step = Number(minSlider.step || 1);

    let minVal = Number(minSlider.value);
    let maxVal = Number(maxSlider.value);

    if (type === "min" && minVal > maxVal - step) {
      minVal = maxVal - step;
      minSlider.value = String(minVal);
    }

    if (type === "max" && maxVal < minVal + step) {
      maxVal = minVal + step;
      maxSlider.value = String(maxVal);
    }

    const sliderMin = Number(minSlider.min);
    const sliderMax = Number(minSlider.max);
    const unit = this._elements.minValue.dataset.unit || "°C";

    this._elements.minValue.textContent = `${this._config.min_label} ${this._format(minVal, unit)}`;
    this._elements.maxValue.textContent = `${this._config.max_label} ${this._format(maxVal, unit)}`;

    this._renderTrack(minVal, maxVal, sliderMin, sliderMax);
  }

  _resolveService(entityId) {
    const [domain] = entityId.split(".");

    if (domain === "input_number" || domain === "number") {
      return { domain, service: "set_value" };
    }

    const serviceId = this._config.set_service;
    if (typeof serviceId === "string" && serviceId.includes(".")) {
      const [serviceDomain, serviceName] = serviceId.split(".");
      return { domain: serviceDomain, service: serviceName };
    }

    return { domain: "number", service: "set_value" };
  }

  async _commit(type) {
    if (!this._hass || !this._config) {
      return;
    }

    if (this._isClimateMode()) {
      const minVal = Number(this._elements.minSlider.value);
      const maxVal = Number(this._elements.maxSlider.value);

      try {
        await this._hass.callService("climate", "set_temperature", {
          entity_id: this._config.climate_entity,
          target_temp_low: minVal,
          target_temp_high: maxVal,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("hyst-slider-card: climate set_temperature failed", error);
      }
      return;
    }

    const entityId = type === "min" ? this._config.min_entity : this._config.max_entity;
    const value = Number(
      type === "min" ? this._elements.minSlider.value : this._elements.maxSlider.value
    );

    const { domain, service } = this._resolveService(entityId);

    try {
      await this._hass.callService(domain, service, {
        entity_id: entityId,
        value,
      });
    } catch (error) {
      // Keep UI responsive even when backend service fails.
      // eslint-disable-next-line no-console
      console.error("hyst-slider-card: set_value service failed", error);
    }
  }

  _render() {
    if (!this._hass || !this._config || !this._elements.minSlider || !this._elements.maxSlider) {
      return;
    }

    const minEntity = this._getEntity(this._config.min_entity);
    const maxEntity = this._getEntity(this._config.max_entity);

    const { sliderMin, sliderMax, sliderStep, unit } = this._resolveMeta(minEntity, maxEntity);

    let minVal;
    let maxVal;
    let unavailable;
    let secondaryText = this._config.subtitle || "";

    if (this._isClimateMode()) {
      const climateData = this._resolveClimateValues(sliderMin, sliderMax);
      minVal = climateData.minVal;
      maxVal = climateData.maxVal;
      unavailable = !climateData.entity;

      const attrs = climateData.entity?.attributes || {};
      const roomTemp = Number.isFinite(Number(attrs.current_temperature))
        ? `Aktualne ${this._format(attrs.current_temperature, unit)}`
        : "";
      const hvacAction = attrs.hvac_action || climateData.entity?.state || "";

      secondaryText =
        this._config.subtitle ||
        [hvacAction, roomTemp].filter(Boolean).join(" • ") ||
        "Climate range";
    } else {
      minVal = this._numState(minEntity, sliderMin);
      maxVal = this._numState(maxEntity, sliderMax);

      minVal = this._clamp(minVal, sliderMin, sliderMax);
      maxVal = this._clamp(maxVal, sliderMin, sliderMax);

      if (minVal > maxVal) {
        const temp = minVal;
        minVal = maxVal;
        maxVal = temp;
      }

      unavailable = !minEntity || !maxEntity;
      secondaryText = this._config.subtitle || "Dvojity rozsah";
    }

    this.style.setProperty(
      "--hyst-slider-accent",
      this._config.accent_color || "var(--state-climate-heat-color, var(--primary-color))"
    );

    this._elements.title.textContent = this._config.title;
    this._elements.subtitle.textContent = secondaryText;
    this._elements.icon.icon = this._config.icon;

    this._elements.minSlider.min = String(sliderMin);
    this._elements.minSlider.max = String(sliderMax);
    this._elements.minSlider.step = String(sliderStep);
    this._elements.minSlider.value = String(minVal);

    this._elements.maxSlider.min = String(sliderMin);
    this._elements.maxSlider.max = String(sliderMax);
    this._elements.maxSlider.step = String(sliderStep);
    this._elements.maxSlider.value = String(maxVal);

    this._elements.minValue.dataset.unit = unit;
    this._elements.minValue.textContent = `${this._config.min_label} ${this._format(minVal, unit)}`;
    this._elements.maxValue.textContent = `${this._config.max_label} ${this._format(maxVal, unit)}`;

    this._elements.leftLimit.textContent = this._format(sliderMin, unit);
    this._elements.rightLimit.textContent = this._format(sliderMax, unit);

    this._elements.minSlider.disabled = unavailable;
    this._elements.maxSlider.disabled = unavailable;

    this._renderTrack(minVal, maxVal, sliderMin, sliderMax);
  }
}

if (!customElements.get("hyst-slider-card")) {
  customElements.define("hyst-slider-card", HystSliderCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.find((card) => card.type === "hyst-slider-card")) {
  window.customCards.push({
    type: "hyst-slider-card",
    name: "Hysteresis Slider Card",
    description: "Dual-thumb slider card for minimum and maximum temperature.",
  });
}
