# HAKit Documentation

This document provides an overview of the constants, helpers, and `HassConnect` component available in the `@hakit/core` library. Links to the official documentation are included for further details.

---

## Constants

The following constants are available in `@hakit/core`:

- **[UNAVAILABLE](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: Represents the string `"unavailable"`.
- **[UNKNOWN](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: Represents the string `"unknown"`.
- **[ON](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: Represents the string `"on"`.
- **[OFF](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: Represents the string `"off"`.
- **[UNIT_C](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: Represents the string `"°C"`.
- **[UNIT_F](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: Represents the string `"°F"`.
- **[DOMAINS_WITH_DYNAMIC_PICTURE](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: A list of domains supporting dynamic picture properties.
- **[DEFAULT_STATES](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: Default states like `"on"`, `"off"`, `"unknown"`, and `"unavailable"`.
- **[UNAVAILABLE_STATES](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: States considered unavailable.
- **[OFF_STATES](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: States considered off.
- **[COLORS](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-constants--docs)**: A list of dynamic colors for entities.

---

## Helpers

The following helpers are available in `@hakit/core`:

- **[isUnavailableState](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Checks if an entity's state is `"unavailable"` or `"unknown"`.
- **[isOffState](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Checks if an entity's state is `"off"`, `"unknown"`, or `"unavailable"`.
- **[supportsFeatureFromAttributes](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Checks if an entity supports a specific feature.
- **[stateActive](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Determines if an entity's state is active.
- **[computeDomainTitle](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Returns a readable title for an entity's domain.
- **[computeDomain](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Returns the domain of an entity.
- **[getCssColorValue](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Retrieves the color value of an entity.
- **[timeAgo](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Converts a date to a human-readable "time ago" string.
- **[lightSupportsColorMode](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Checks if a light supports a specific color mode.
- **[lightIsInColorMode](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Checks if a light is in a specific color mode.
- **[lightSupportsColor](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Checks if a light supports color.
- **[lightSupportsBrightness](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Checks if a light supports brightness.
- **[getLightCurrentModeRgbColor](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Retrieves the current RGB color of a light.
- **[getColorByIndex](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Retrieves a color from the `COLORS` list by index.
- **[stateColorBrightness](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Retrieves the brightness of an entity's color.
- **[Color Conversion](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Includes functions like `hex2rgb`, `rgb2hex`, `rgbContrast`, etc.
- **[temperature2rgb](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-helpers--docs)**: Converts a temperature in Kelvin to an RGB color.

---

## HassConnect

The `HassConnect` component handles authentication and provides access to the Home Assistant API. Key features include:

- **[Authentication](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hassconnect--docs)**: Handles Home Assistant authentication and renders child components upon success.
- **Advanced Features**:
  - **PortalRoot**: Specifies a custom portal element for modals, tooltips, etc.
  - **Suspend/Resume Logic**: Configures connection suspension when tabs are inactive.
  - **Locale/Language**: Overrides the default locale set in Home Assistant.
  - **Error Rendering**: Customizes error messages for authentication failures.
- **Component Props**:
  - `hassUrl`: URL of the Home Assistant instance.
  - `hassToken`: Optional token to bypass the login screen.
  - `onReady`: Callback triggered after successful entity subscription.

---

## Hooks

The following hooks are available in `@hakit/core`. Each hook provides specific functionality to interact with your Home Assistant instance.

### Core Hooks

- **[useHass](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass--docs)**: The main hook to access all data (entities, areas, floors, etc.) and helper functions.
  - **[callApi](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-callapi--docs)**: Trigger requests to the Home Assistant REST API.
  - **[callService](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-callservice--docs)**: Call Home Assistant services.
  - **[getAllEntities](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-getallentities--docs)**: Retrieve all entities.
  - **[helpers](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-helpers--docs)**: Access utility methods grouped by concern.
  - **[joinHassUrl](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-joinhassurl--docs)**: Join a path with the base Home Assistant URL.
  - **[programmatic](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-programmatic--docs)**: Access state programmatically via `useHass.getState()`.
  - **[styling](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-styling--docs)**: Manage global component styles.

### Specific Functionality Hooks

- **[useAreas](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useareas--docs)**: Access area registry data.
- **[useCamera](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usecamera--docs)**: Interact with camera entities.
- **[useConfig](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useconfig--docs)**: Subscribe to Home Assistant configuration updates.
- **[useDevice](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usedevice--docs)**: Access device registry entries.
- **[useEntities](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useentities--docs)**: Subscribe to multiple entities.
- **[useEntity](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useentity--docs)**: Subscribe to a single entity.
- **[useFloors](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usefloors--docs)**: Access floor registry data.
- **[useHaStatus](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehastatus--docs)**: Get the current status of the Home Assistant instance.
- **[useHistory](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehistory--docs)**: Retrieve historical data for entities.
- **[useIcon](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useicon--docs)**: Get icons for entities or domains.
- **[useIconByDomain](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useiconbydomain--docs)**: Get an icon based on a domain.
- **[useIconByEntity](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useiconbyentity--docs)**: Get an icon based on an entity.
- **[useLightBrightness](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-uselightbrightness--docs)**: Manage light brightness.
- **[useLightColor](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-uselightcolor--docs)**: Manage light color.
- **[useLightTemperature](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-uselighttemperature--docs)**: Manage light temperature.
- **[useLocaleData](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-uselocaledata--docs)**: Access locale-specific data.
- **[useLocales](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-uselocales--docs)**: Access available locales.
- **[useLogs](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-uselogs--docs)**: Access Home Assistant logs.
- **[useLowDevices](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-uselowdevices--docs)**: Identify devices with low battery or other issues.
- **[useRegistryData](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useregistrydata--docs)**: Access entity registry display data.
- **[useService](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useservice--docs)**: Access specific service calling functionality.
- **[useSubscribeEntity](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usesubscribeentity--docs)**: Subscribe to a specific entity without using the global store.
- **[useTemplate](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usetemplate--docs)**: Render Home Assistant templates.
- **[useUser](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useuser--docs)**: Access current user data.
- **[useUsers](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useusers--docs)**: Access all users in the instance.
- **[useWeather](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-useweather--docs)**: Access weather entity data.

---

## Stories & Demos

- **[AlarmCard - Alarm Card With No Keypad Support](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-alarmcard--alarm-card-with-no-keypad-support)**
- **[AreaCard - Multiple Areas Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-areacard--multiple-areas-example)**
- **[ButtonCard - Detailed Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-buttoncard--detailed-example)**
- **[ClimateCard - Climate With Temperature Controls Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-climatecard--climate-with-temperature-controls-example)**
- **[ClimateCard - Climate Card With Custom Hvac Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-climatecard--climate-card-with-custom-hvac-example)**
- **[ClimateCard - Climate Card Unavailable Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-climatecard--climate-card-unavailable-example)**
- **[FamilyCard - Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-familycard-personcard--example)**
- **[SidebarCard - Sidebar Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-sidebarcard--sidebar-example)**
- **[SidebarCard - Sidebar Tooltips When Closed Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-sidebarcard--sidebar-tooltips-when-closed-example)**
- **[WeatherCard - Without Forecast Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-weathercard--without-forecast-example)**
- **[WeatherCard - Without Current Example](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-weathercard--without-current-example)**
- **[WeatherCard - With Sensors Examples](https://shannonhochkins.github.io/ha-component-kit/?path=/story/components-cards-weathercard--with-sensors-examples)**

---

For more details, visit the [HAKit Documentation](https://shannonhochkins.github.io/ha-component-kit/).
