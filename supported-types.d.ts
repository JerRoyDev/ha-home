// this is an auto generated file, do not change this manually

import { ServiceFunction, ServiceFunctionTypes } from "@hakit/core";
declare module "@hakit/core" {
  export interface CustomSupportedServices<
    T extends ServiceFunctionTypes = "target",
  > {
    persistentNotification: {
      // undefined
      create: ServiceFunction<
        object,
        T,
        {
          //  @example Please check your configuration.yaml.
          message: string;
          //  @example Test notification
          title?: string;
          //  @example 1234
          notification_id?: string;
        }
      >;
      // undefined
      dismiss: ServiceFunction<
        object,
        T,
        {
          //  @example 1234
          notification_id: string;
        }
      >;
      // undefined
      dismissAll: ServiceFunction<object, T, object>;
    };
    homeassistant: {
      // undefined
      savePersistentStates: ServiceFunction<object, T, object>;
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
      // undefined
      stop: ServiceFunction<object, T, object>;
      // undefined
      restart: ServiceFunction<object, T, object>;
      // undefined
      checkConfig: ServiceFunction<object, T, object>;
      // undefined
      updateEntity: ServiceFunction<
        object,
        T,
        {
          //
          entity_id: string;
        }
      >;
      // undefined
      reloadCoreConfig: ServiceFunction<object, T, object>;
      // undefined
      setLocation: ServiceFunction<
        object,
        T,
        {
          //  @example 32.87336 @constraints  number: mode: box, min: -90, max: 90, step: any
          latitude: number;
          //  @example 117.22743 @constraints  number: mode: box, min: -180, max: 180, step: any
          longitude: number;
          //  @example 120 @constraints  number: mode: box, step: any
          elevation?: number;
        }
      >;
      // undefined
      reloadCustomTemplates: ServiceFunction<object, T, object>;
      // undefined
      reloadConfigEntry: ServiceFunction<
        object,
        T,
        {
          //  @example 8955375327824e14ba89e4b29cc3ec9a @constraints  config_entry:
          entry_id?: unknown;
        }
      >;
      // undefined
      reloadAll: ServiceFunction<object, T, object>;
    };
    systemLog: {
      // undefined
      clear: ServiceFunction<object, T, object>;
      // undefined
      write: ServiceFunction<
        object,
        T,
        {
          //  @example Something went wrong
          message: string;
          //
          level?: "debug" | "info" | "warning" | "error" | "critical";
          //  @example mycomponent.myplatform
          logger?: string;
        }
      >;
    };
    logger: {
      // undefined
      setDefaultLevel: ServiceFunction<
        object,
        T,
        {
          //
          level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
        }
      >;
      // undefined
      setLevel: ServiceFunction<object, T, object>;
    };
    frontend: {
      // undefined
      setTheme: ServiceFunction<
        object,
        T,
        {
          //  @example default
          name?: string;
          //  @example default
          name_dark?: string;
        }
      >;
      // undefined
      reloadThemes: ServiceFunction<object, T, object>;
    };
    recorder: {
      // undefined
      purge: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 365, unit_of_measurement: days, step: 1, mode: slider
          keep_days?: number;
          //  @constraints  boolean:
          repack?: boolean;
          //  @constraints  boolean:
          apply_filter?: boolean;
        }
      >;
      // undefined
      purgeEntities: ServiceFunction<
        object,
        T,
        {
          //
          entity_id?: string;
          //  @example sun @constraints  object: multiple: false
          domains?: object;
          //  @example domain*.object_id* @constraints  object: multiple: false
          entity_globs?: object;
          //  @constraints  number: min: 0, max: 365, unit_of_measurement: days, step: 1, mode: slider
          keep_days?: number;
        }
      >;
      // undefined
      enable: ServiceFunction<object, T, object>;
      // undefined
      disable: ServiceFunction<object, T, object>;
      // undefined
      getStatistics: ServiceFunction<
        object,
        T,
        {
          //  @example 2025-01-01 00:00:00 @constraints  datetime:
          start_time: string;
          //  @example 2025-01-02 00:00:00 @constraints  datetime:
          end_time?: string;
          //  @example sensor.energy_consumption,sensor.temperature @constraints  statistic: multiple: true
          statistic_ids: unknown;
          //  @example hour
          period: "5minute" | "hour" | "day" | "week" | "month";
          //  @example mean,sum
          types:
            | "change"
            | "last_reset"
            | "max"
            | "mean"
            | "min"
            | "state"
            | "sum";
          //  @example [object Object] @constraints  object: multiple: false
          units?: object;
        }
      >;
    };
    hassio: {
      // undefined
      addonStart: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  addon:
          addon: string;
        }
      >;
      // undefined
      addonStop: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  addon:
          addon: string;
        }
      >;
      // undefined
      addonRestart: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  addon:
          addon: string;
        }
      >;
      // undefined
      addonStdin: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  addon:
          addon: string;
        }
      >;
      // undefined
      appStart: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  app:
          app: unknown;
        }
      >;
      // undefined
      appStop: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  app:
          app: unknown;
        }
      >;
      // undefined
      appRestart: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  app:
          app: unknown;
        }
      >;
      // undefined
      appStdin: ServiceFunction<
        object,
        T,
        {
          //  @example core_ssh @constraints  app:
          app: unknown;
          //  @constraints  object: multiple: false
          input: object;
        }
      >;
      // undefined
      hostShutdown: ServiceFunction<object, T, object>;
      // undefined
      hostReboot: ServiceFunction<object, T, object>;
      // undefined
      backupFull: ServiceFunction<
        object,
        T,
        {
          //  @example Backup 1
          name?: string;
          //  @example password
          password?: string;
          //  @constraints  boolean:
          compressed?: boolean;
          //  @example my_backup_mount @constraints  backup_location:
          location?: string;
          //  @constraints  boolean:
          homeassistant_exclude_database?: boolean;
        }
      >;
      // undefined
      backupPartial: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          homeassistant?: boolean;
          //  @constraints  boolean:
          homeassistant_exclude_database?: boolean;
          //  @example core_ssh,core_samba,core_mosquitto @constraints  object: multiple: false
          apps?: object;
          //  @example core_ssh,core_samba,core_mosquitto @constraints  object: multiple: false
          addons?: object;
          //  @example homeassistant,share @constraints  object: multiple: false
          folders?: object;
          //  @example Partial backup 1
          name?: string;
          //  @example password
          password?: string;
          //  @constraints  boolean:
          compressed?: boolean;
          //  @example my_backup_mount @constraints  backup_location:
          location?: string;
        }
      >;
      // undefined
      restoreFull: ServiceFunction<
        object,
        T,
        {
          //
          slug: string;
          //  @example password
          password?: string;
        }
      >;
      // undefined
      restorePartial: ServiceFunction<
        object,
        T,
        {
          //
          slug: string;
          //  @constraints  boolean:
          homeassistant?: boolean;
          //  @example homeassistant,share @constraints  object: multiple: false
          folders?: object;
          //  @example core_ssh,core_samba,core_mosquitto @constraints  object: multiple: false
          apps?: object;
          //  @example core_ssh,core_samba,core_mosquitto @constraints  object: multiple: false
          addons?: object;
          //  @example password
          password?: string;
        }
      >;
    };
    ffmpeg: {
      // undefined
      start: ServiceFunction<
        object,
        T,
        {
          //
          entity_id?: string;
        }
      >;
      // undefined
      stop: ServiceFunction<
        object,
        T,
        {
          //
          entity_id?: string;
        }
      >;
      // undefined
      restart: ServiceFunction<
        object,
        T,
        {
          //
          entity_id?: string;
        }
      >;
    };
    tts: {
      // undefined
      speak: ServiceFunction<
        object,
        T,
        {
          //
          media_player_entity_id: string;
          //  @example My name is hanna
          message: string;
          //  @constraints  boolean:
          cache?: boolean;
          //  @example ru
          language?: string;
          //  @example platform specific @constraints  object: multiple: false
          options?: object;
        }
      >;
      // undefined
      clearCache: ServiceFunction<object, T, object>;
      // Say something using text-to-speech on a media player with cloud.
      cloudSay: ServiceFunction<
        object,
        T,
        {
          //
          entity_id: string;
          //  @example My name is hanna
          message: string;
          //
          cache?: boolean;
          //  @example ru
          language?: string;
          //  @example platform specific
          options?: object;
        }
      >;
    };
    switch: {
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
    };
    update: {
      // undefined
      install: ServiceFunction<
        object,
        T,
        {
          //  @example 1.0.0
          version?: string;
          //  @constraints  boolean:
          backup?: boolean;
        }
      >;
      // undefined
      skip: ServiceFunction<object, T, object>;
      // undefined
      clearSkipped: ServiceFunction<object, T, object>;
    };
    backup: {
      // undefined
      createAutomatic: ServiceFunction<object, T, object>;
    };
    conversation: {
      // undefined
      process: ServiceFunction<
        object,
        T,
        {
          //  @example Turn all lights on
          text: string;
          //  @example NL
          language?: string;
          //  @example homeassistant @constraints  conversation_agent:
          agent_id?: string;
          //  @example my_conversation_1
          conversation_id?: string;
        }
      >;
      // undefined
      reload: ServiceFunction<
        object,
        T,
        {
          //  @example NL
          language?: string;
          //  @example homeassistant @constraints  conversation_agent:
          agent_id?: string;
        }
      >;
    };
    cloud: {
      // undefined
      remoteConnect: ServiceFunction<object, T, object>;
      // undefined
      remoteDisconnect: ServiceFunction<object, T, object>;
    };
    camera: {
      // undefined
      enableMotionDetection: ServiceFunction<object, T, object>;
      // undefined
      disableMotionDetection: ServiceFunction<object, T, object>;
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      snapshot: ServiceFunction<
        object,
        T,
        {
          //  @example /tmp/snapshot_{{ entity_id.name }}.jpg
          filename: string;
        }
      >;
      // undefined
      playStream: ServiceFunction<
        object,
        T,
        {
          //
          media_player: string;
          //
          format?: "hls";
        }
      >;
      // undefined
      record: ServiceFunction<
        object,
        T,
        {
          //  @example /tmp/snapshot_{{ entity_id.name }}.mp4
          filename: string;
          //  @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds, step: 1, mode: slider
          duration?: number;
          //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
          lookback?: number;
        }
      >;
    };
    scene: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      apply: ServiceFunction<
        object,
        T,
        {
          //  @example light.kitchen: 'on' light.ceiling:   state: 'on'   brightness: 80  @constraints  object: multiple: false
          entities: object;
          //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
          transition?: number;
        }
      >;
      // undefined
      create: ServiceFunction<
        object,
        T,
        {
          //  @example all_lights
          scene_id: string;
          //  @example light.tv_back_light: 'on' light.ceiling:   state: 'on'   brightness: 200  @constraints  object: multiple: false
          entities?: object;
          //  @example - light.ceiling - light.kitchen
          snapshot_entities?: string;
        }
      >;
      // undefined
      delete: ServiceFunction<object, T, object>;
      // undefined
      turnOn: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
          transition?: number;
        }
      >;
    };
    logbook: {
      // undefined
      log: ServiceFunction<
        object,
        T,
        {
          //  @example Kitchen
          name: string;
          //  @example is being used
          message: string;
          //
          entity_id?: string;
          //  @example light
          domain?: string;
        }
      >;
    };
    inputBoolean: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
    };
    inputButton: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      press: ServiceFunction<object, T, object>;
    };
    inputSelect: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      selectFirst: ServiceFunction<object, T, object>;
      // undefined
      selectLast: ServiceFunction<object, T, object>;
      // undefined
      selectNext: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          cycle?: boolean;
        }
      >;
      // undefined
      selectOption: ServiceFunction<
        object,
        T,
        {
          //  @example 'Item A' @constraints  state: hide_states: unavailable,unknown, multiple: false
          option: unknown;
        }
      >;
      // undefined
      selectPrevious: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          cycle?: boolean;
        }
      >;
      // undefined
      setOptions: ServiceFunction<
        object,
        T,
        {
          //  @example ['Item A', 'Item B', 'Item C']
          options: string;
        }
      >;
    };
    inputNumber: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      setValue: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 9223372036854776000, step: 0.001, mode: box
          value: number;
        }
      >;
      // undefined
      increment: ServiceFunction<object, T, object>;
      // undefined
      decrement: ServiceFunction<object, T, object>;
    };
    timer: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      start: ServiceFunction<
        object,
        T,
        {
          //  @example 00:01:00 or 60 @constraints  duration:
          duration?: {
            hours?: number;
            days?: number;
            minutes?: number;
            seconds?: number;
          };
        }
      >;
      // undefined
      pause: ServiceFunction<object, T, object>;
      // undefined
      cancel: ServiceFunction<object, T, object>;
      // undefined
      finish: ServiceFunction<object, T, object>;
      // undefined
      change: ServiceFunction<
        object,
        T,
        {
          //  @example 00:01:00, 60 or -60 @constraints  duration: allow_negative: true
          duration: {
            hours?: number;
            days?: number;
            minutes?: number;
            seconds?: number;
          };
        }
      >;
    };
    script: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
    };
    automation: {
      // undefined
      trigger: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          skip_condition?: boolean;
        }
      >;
      // undefined
      toggle: ServiceFunction<object, T, object>;
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      turnOff: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          stop_actions?: boolean;
        }
      >;
      // undefined
      reload: ServiceFunction<object, T, object>;
    };
    zone: {
      // undefined
      reload: ServiceFunction<object, T, object>;
    };
    person: {
      // undefined
      reload: ServiceFunction<object, T, object>;
    };
    assistSatellite: {
      // undefined
      announce: ServiceFunction<
        object,
        T,
        {
          //  @example Time to wake up!
          message?: string;
          //  @constraints  media: accept: audio/*, multiple: false
          media_id?: unknown;
          //  @constraints  boolean:
          preannounce?: boolean;
          //  @constraints  media: accept: audio/*, multiple: false
          preannounce_media_id?: unknown;
        }
      >;
      // undefined
      startConversation: ServiceFunction<
        object,
        T,
        {
          //  @example You left the lights on in the living room. Turn them off?
          start_message?: string;
          //  @constraints  media: accept: audio/*, multiple: false
          start_media_id?: unknown;
          //
          extra_system_prompt?: string;
          //  @constraints  boolean:
          preannounce?: boolean;
          //  @constraints  media: accept: audio/*, multiple: false
          preannounce_media_id?: unknown;
        }
      >;
      // undefined
      askQuestion: ServiceFunction<
        object,
        T,
        {
          //
          entity_id: string;
          //  @example What kind of music would you like to play?
          question?: string;
          //  @constraints  media: accept: audio/*, multiple: false
          question_media_id?: unknown;
          //  @constraints  boolean:
          preannounce?: boolean;
          //  @constraints  media: accept: audio/*, multiple: false
          preannounce_media_id?: unknown;
          //  @constraints  object: label_field: sentences, description_field: id, multiple: true, translation_key: answers, fields: [object Object]
          answers?: object;
        }
      >;
    };
    shoppingList: {
      // undefined
      addItem: ServiceFunction<
        object,
        T,
        {
          //  @example Beer
          name: string;
        }
      >;
      // undefined
      removeItem: ServiceFunction<
        object,
        T,
        {
          //  @example Beer
          name: string;
        }
      >;
      // undefined
      completeItem: ServiceFunction<
        object,
        T,
        {
          //  @example Beer
          name: string;
        }
      >;
      // undefined
      incompleteItem: ServiceFunction<
        object,
        T,
        {
          //  @example Beer
          name: string;
        }
      >;
      // undefined
      completeAll: ServiceFunction<object, T, object>;
      // undefined
      incompleteAll: ServiceFunction<object, T, object>;
      // undefined
      clearCompletedItems: ServiceFunction<object, T, object>;
      // undefined
      sort: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          reverse?: boolean;
        }
      >;
    };
    file: {
      // undefined
      readFile: ServiceFunction<
        object,
        T,
        {
          //  @example www/my_file.json
          file_name?: string;
          //  @example JSON
          file_encoding?: "JSON" | "YAML";
        }
      >;
    };
    fullyKiosk: {
      // undefined
      loadUrl: ServiceFunction<
        object,
        T,
        {
          //
          device_id: string;
          //  @example https://home-assistant.io
          url: string;
        }
      >;
      // undefined
      startApplication: ServiceFunction<
        object,
        T,
        {
          //  @example de.ozerov.fully
          application: string;
          //
          device_id: string;
        }
      >;
      // undefined
      setConfig: ServiceFunction<
        object,
        T,
        {
          //
          device_id: string;
          //  @example motionSensitivity
          key: string;
          //  @example 90
          value: string;
        }
      >;
    };
    inputText: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      setValue: ServiceFunction<
        object,
        T,
        {
          //  @example This is an example text
          value: string;
        }
      >;
    };
    schedule: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      getSchedule: ServiceFunction<object, T, object>;
    };
    duckdns: {
      // undefined
      setTxt: ServiceFunction<
        object,
        T,
        {
          //  @constraints  config_entry: integration: duckdns
          config_entry_id?: unknown;
          //  @example This domain name is reserved for use in documentation
          txt?: string;
        }
      >;
    };
    cast: {
      // undefined
      showLovelaceView: ServiceFunction<
        object,
        T,
        {
          //
          entity_id: string;
          //  @example lovelace-cast
          dashboard_path?: string;
          //  @example downstairs
          view_path: string;
        }
      >;
    };
    openaiConversation: {
      // undefined
      generateContent: ServiceFunction<
        object,
        T,
        {
          //  @constraints  config_entry: integration: openai_conversation
          config_entry: unknown;
          //  @example Hello, how can I help you?
          prompt: string;
          //  @example - /path/to/file1.txt - /path/to/file2.txt
          filenames?: string;
        }
      >;
      // undefined
      generateImage: ServiceFunction<
        object,
        T,
        {
          //  @constraints  config_entry: integration: openai_conversation
          config_entry: unknown;
          //
          prompt: string;
          //  @example 1024x1024
          size?: "1024x1024" | "1024x1792" | "1792x1024";
          //  @example standard
          quality?: "standard" | "hd";
          //  @example vivid
          style?: "vivid" | "natural";
        }
      >;
    };
    counter: {
      // undefined
      increment: ServiceFunction<object, T, object>;
      // undefined
      decrement: ServiceFunction<object, T, object>;
      // undefined
      reset: ServiceFunction<object, T, object>;
      // undefined
      setValue: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 9223372036854776000, mode: box, step: 1
          value: number;
        }
      >;
    };
    inputDatetime: {
      // undefined
      reload: ServiceFunction<object, T, object>;
      // undefined
      setDatetime: ServiceFunction<
        object,
        T,
        {
          //  @example '2019-04-20'
          date?: string;
          //  @example '05:04:20' @constraints  time:
          time?: string;
          //  @example '2019-04-20 05:04:20'
          datetime?: string;
          //  @constraints  number: min: 0, max: 9223372036854776000, mode: box, step: 1
          timestamp?: number;
        }
      >;
    };
    light: {
      // undefined
      turnOn: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
          transition?: number;
          //  @example [255, 100, 100] @constraints  color_rgb:
          rgb_color?: [number, number, number];
          //  @constraints  color_temp: unit: kelvin, min: 2000, max: 6500
          color_temp_kelvin?: number;
          //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
          brightness_pct?: number;
          //  @constraints  number: min: -100, max: 100, unit_of_measurement: %, step: 1, mode: slider
          brightness_step_pct?: number;
          //
          effect?: string;
          //  @example [255, 100, 100, 50] @constraints  object: multiple: false
          rgbw_color?: [number, number, number, number];
          //  @example [255, 100, 100, 50, 70] @constraints  object: multiple: false
          rgbww_color?: [number, number, number, number, number];
          //
          color_name?:
            | "homeassistant"
            | "aliceblue"
            | "antiquewhite"
            | "aqua"
            | "aquamarine"
            | "azure"
            | "beige"
            | "bisque"
            | "blanchedalmond"
            | "blue"
            | "blueviolet"
            | "brown"
            | "burlywood"
            | "cadetblue"
            | "chartreuse"
            | "chocolate"
            | "coral"
            | "cornflowerblue"
            | "cornsilk"
            | "crimson"
            | "cyan"
            | "darkblue"
            | "darkcyan"
            | "darkgoldenrod"
            | "darkgray"
            | "darkgreen"
            | "darkgrey"
            | "darkkhaki"
            | "darkmagenta"
            | "darkolivegreen"
            | "darkorange"
            | "darkorchid"
            | "darkred"
            | "darksalmon"
            | "darkseagreen"
            | "darkslateblue"
            | "darkslategray"
            | "darkslategrey"
            | "darkturquoise"
            | "darkviolet"
            | "deeppink"
            | "deepskyblue"
            | "dimgray"
            | "dimgrey"
            | "dodgerblue"
            | "firebrick"
            | "floralwhite"
            | "forestgreen"
            | "fuchsia"
            | "gainsboro"
            | "ghostwhite"
            | "gold"
            | "goldenrod"
            | "gray"
            | "green"
            | "greenyellow"
            | "grey"
            | "honeydew"
            | "hotpink"
            | "indianred"
            | "indigo"
            | "ivory"
            | "khaki"
            | "lavender"
            | "lavenderblush"
            | "lawngreen"
            | "lemonchiffon"
            | "lightblue"
            | "lightcoral"
            | "lightcyan"
            | "lightgoldenrodyellow"
            | "lightgray"
            | "lightgreen"
            | "lightgrey"
            | "lightpink"
            | "lightsalmon"
            | "lightseagreen"
            | "lightskyblue"
            | "lightslategray"
            | "lightslategrey"
            | "lightsteelblue"
            | "lightyellow"
            | "lime"
            | "limegreen"
            | "linen"
            | "magenta"
            | "maroon"
            | "mediumaquamarine"
            | "mediumblue"
            | "mediumorchid"
            | "mediumpurple"
            | "mediumseagreen"
            | "mediumslateblue"
            | "mediumspringgreen"
            | "mediumturquoise"
            | "mediumvioletred"
            | "midnightblue"
            | "mintcream"
            | "mistyrose"
            | "moccasin"
            | "navajowhite"
            | "navy"
            | "navyblue"
            | "oldlace"
            | "olive"
            | "olivedrab"
            | "orange"
            | "orangered"
            | "orchid"
            | "palegoldenrod"
            | "palegreen"
            | "paleturquoise"
            | "palevioletred"
            | "papayawhip"
            | "peachpuff"
            | "peru"
            | "pink"
            | "plum"
            | "powderblue"
            | "purple"
            | "red"
            | "rosybrown"
            | "royalblue"
            | "saddlebrown"
            | "salmon"
            | "sandybrown"
            | "seagreen"
            | "seashell"
            | "sienna"
            | "silver"
            | "skyblue"
            | "slateblue"
            | "slategray"
            | "slategrey"
            | "snow"
            | "springgreen"
            | "steelblue"
            | "tan"
            | "teal"
            | "thistle"
            | "tomato"
            | "turquoise"
            | "violet"
            | "wheat"
            | "white"
            | "whitesmoke"
            | "yellow"
            | "yellowgreen";
          //  @example [300, 70] @constraints  object: multiple: false
          hs_color?: [number, number];
          //  @example [0.52, 0.43] @constraints  object: multiple: false
          xy_color?: [number, number];
          //  @constraints  color_temp: unit: mired, min: 153, max: 500
          color_temp?: number;
          //  @constraints  number: min: 0, max: 255, step: 1, mode: slider
          brightness?: number;
          //  @constraints  number: min: -225, max: 255, step: 1, mode: slider
          brightness_step?: number;
          //
          white?: boolean;
          //  @example relax
          profile?: string;
          //
          flash?: "long" | "short";
        }
      >;
      // undefined
      turnOff: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
          transition?: number;
          //
          flash?: "long" | "short";
        }
      >;
      // undefined
      toggle: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
          transition?: number;
          //  @example [255, 100, 100] @constraints  color_rgb:
          rgb_color?: [number, number, number];
          //  @constraints  color_temp: unit: kelvin, min: 2000, max: 6500
          color_temp_kelvin?: number;
          //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
          brightness_pct?: number;
          //
          effect?: string;
          //  @example [255, 100, 100, 50] @constraints  object: multiple: false
          rgbw_color?: [number, number, number, number];
          //  @example [255, 100, 100, 50, 70] @constraints  object: multiple: false
          rgbww_color?: [number, number, number, number, number];
          //
          color_name?:
            | "homeassistant"
            | "aliceblue"
            | "antiquewhite"
            | "aqua"
            | "aquamarine"
            | "azure"
            | "beige"
            | "bisque"
            | "blanchedalmond"
            | "blue"
            | "blueviolet"
            | "brown"
            | "burlywood"
            | "cadetblue"
            | "chartreuse"
            | "chocolate"
            | "coral"
            | "cornflowerblue"
            | "cornsilk"
            | "crimson"
            | "cyan"
            | "darkblue"
            | "darkcyan"
            | "darkgoldenrod"
            | "darkgray"
            | "darkgreen"
            | "darkgrey"
            | "darkkhaki"
            | "darkmagenta"
            | "darkolivegreen"
            | "darkorange"
            | "darkorchid"
            | "darkred"
            | "darksalmon"
            | "darkseagreen"
            | "darkslateblue"
            | "darkslategray"
            | "darkslategrey"
            | "darkturquoise"
            | "darkviolet"
            | "deeppink"
            | "deepskyblue"
            | "dimgray"
            | "dimgrey"
            | "dodgerblue"
            | "firebrick"
            | "floralwhite"
            | "forestgreen"
            | "fuchsia"
            | "gainsboro"
            | "ghostwhite"
            | "gold"
            | "goldenrod"
            | "gray"
            | "green"
            | "greenyellow"
            | "grey"
            | "honeydew"
            | "hotpink"
            | "indianred"
            | "indigo"
            | "ivory"
            | "khaki"
            | "lavender"
            | "lavenderblush"
            | "lawngreen"
            | "lemonchiffon"
            | "lightblue"
            | "lightcoral"
            | "lightcyan"
            | "lightgoldenrodyellow"
            | "lightgray"
            | "lightgreen"
            | "lightgrey"
            | "lightpink"
            | "lightsalmon"
            | "lightseagreen"
            | "lightskyblue"
            | "lightslategray"
            | "lightslategrey"
            | "lightsteelblue"
            | "lightyellow"
            | "lime"
            | "limegreen"
            | "linen"
            | "magenta"
            | "maroon"
            | "mediumaquamarine"
            | "mediumblue"
            | "mediumorchid"
            | "mediumpurple"
            | "mediumseagreen"
            | "mediumslateblue"
            | "mediumspringgreen"
            | "mediumturquoise"
            | "mediumvioletred"
            | "midnightblue"
            | "mintcream"
            | "mistyrose"
            | "moccasin"
            | "navajowhite"
            | "navy"
            | "navyblue"
            | "oldlace"
            | "olive"
            | "olivedrab"
            | "orange"
            | "orangered"
            | "orchid"
            | "palegoldenrod"
            | "palegreen"
            | "paleturquoise"
            | "palevioletred"
            | "papayawhip"
            | "peachpuff"
            | "peru"
            | "pink"
            | "plum"
            | "powderblue"
            | "purple"
            | "red"
            | "rosybrown"
            | "royalblue"
            | "saddlebrown"
            | "salmon"
            | "sandybrown"
            | "seagreen"
            | "seashell"
            | "sienna"
            | "silver"
            | "skyblue"
            | "slateblue"
            | "slategray"
            | "slategrey"
            | "snow"
            | "springgreen"
            | "steelblue"
            | "tan"
            | "teal"
            | "thistle"
            | "tomato"
            | "turquoise"
            | "violet"
            | "wheat"
            | "white"
            | "whitesmoke"
            | "yellow"
            | "yellowgreen";
          //  @example [300, 70] @constraints  object: multiple: false
          hs_color?: [number, number];
          //  @example [0.52, 0.43] @constraints  object: multiple: false
          xy_color?: [number, number];
          //  @constraints  color_temp: unit: mired, min: 153, max: 500
          color_temp?: number;
          //  @constraints  number: min: 0, max: 255, step: 1, mode: slider
          brightness?: number;
          //
          white?: boolean;
          //  @example relax
          profile?: string;
          //
          flash?: "long" | "short";
        }
      >;
    };
    mediaPlayer: {
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
      // undefined
      volumeUp: ServiceFunction<object, T, object>;
      // undefined
      volumeDown: ServiceFunction<object, T, object>;
      // undefined
      mediaPlayPause: ServiceFunction<object, T, object>;
      // undefined
      mediaPlay: ServiceFunction<object, T, object>;
      // undefined
      mediaPause: ServiceFunction<object, T, object>;
      // undefined
      mediaStop: ServiceFunction<object, T, object>;
      // undefined
      mediaNextTrack: ServiceFunction<object, T, object>;
      // undefined
      mediaPreviousTrack: ServiceFunction<object, T, object>;
      // undefined
      clearPlaylist: ServiceFunction<object, T, object>;
      // undefined
      volumeSet: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 1, step: 0.01, mode: slider
          volume_level: number;
        }
      >;
      // undefined
      volumeMute: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          is_volume_muted: boolean;
        }
      >;
      // undefined
      mediaSeek: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 9223372036854776000, step: 0.01, mode: box
          seek_position: number;
        }
      >;
      // undefined
      join: ServiceFunction<
        object,
        T,
        {
          //  @example - media_player.multiroom_player2 - media_player.multiroom_player3
          group_members: string[];
        }
      >;
      // undefined
      selectSource: ServiceFunction<
        object,
        T,
        {
          //  @example video1
          source: string;
        }
      >;
      // undefined
      selectSoundMode: ServiceFunction<
        object,
        T,
        {
          //  @example Music
          sound_mode?: string;
        }
      >;
      // undefined
      playMedia: ServiceFunction<
        object,
        T,
        {
          //  @example {'media_content_id': 'https://home-assistant.io/images/cast/splash.png', 'media_content_type': 'music'} @constraints  media: multiple: false
          media: unknown;
          //
          enqueue?: "play" | "next" | "add" | "replace";
          //  @example true @constraints  boolean:
          announce?: boolean;
        }
      >;
      // undefined
      browseMedia: ServiceFunction<
        object,
        T,
        {
          //  @example music
          media_content_type?: string;
          //  @example A:ALBUMARTIST/Beatles
          media_content_id?: string | number;
        }
      >;
      // undefined
      searchMedia: ServiceFunction<
        object,
        T,
        {
          //  @example Beatles
          search_query: string;
          //  @example music
          media_content_type?: string;
          //  @example A:ALBUMARTIST/Beatles
          media_content_id?: string | number;
          //  @example album,artist
          media_filter_classes?: string;
        }
      >;
      // undefined
      shuffleSet: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          shuffle: boolean;
        }
      >;
      // undefined
      unjoin: ServiceFunction<object, T, object>;
      // undefined
      repeatSet: ServiceFunction<
        object,
        T,
        {
          //
          repeat: "off" | "all" | "one";
        }
      >;
    };
    browserMod: {
      // Run a sequence of services
      sequence: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // List of services to run @constraints  object: multiple: false
          sequence?: object;
        }
      >;
      // Wait for a time
      delay: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // Time to wait (ms) @constraints  number: mode: box, step: 1
          time?: number;
        }
      >;
      // Display a popup
      popup: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // ID of the popup-card to use as a template for the popup
          popup_card_id?: string;
          // Popup title
          title?: string;
          // Popup content (Text or lovelace card configuration) @constraints  object: multiple: false
          content: object;
          // Initial style to apply to the popup
          initial_style?: "normal" | "classic" | "wide" | "fullscreen";
          // Sequence of styles to cycle through when user taps the title or with browser_mod.set_popup_style service
          style_sequence?:
            | "initial"
            | "normal"
            | "classic"
            | "wide"
            | "fullscreen";
          // Popup styles to apply. Use 'all' to always apply the style. You can add to standard styles or create your own @constraints  object: label_field: style, description_field: include_styles, multiple: true, fields: [object Object]
          popup_styles?: object;
          // Text of the right button
          right_button?: string;
          // Variant of the right button
          right_button_variant?:
            | "brand"
            | "neutral"
            | "danger"
            | "warning"
            | "success";
          // Appearance of the right button
          right_button_appearance?: "accent" | "filled" | "outlined" | "plain";
          // Action to perform when the right button is pressed @constraints  object: multiple: false
          right_button_action?: object;
          // Text of the left button
          left_button?: string;
          // Variant of the left button
          left_button_variant?:
            | "brand"
            | "neutral"
            | "danger"
            | "warning"
            | "success";
          // Appearance of the left button
          left_button_appearance?: "accent" | "filled" | "outlined" | "plain";
          // Action to perform when left button is pressed @constraints  object: multiple: false
          left_button_action?: object;
          // Whether the popup can be closed by the user without action @constraints  boolean:
          dismissable?: boolean;
          // Action to perform when popup is dismissed @constraints  object: multiple: false
          dismiss_action?: object;
          // Close the popup automatically on mouse, pointer or keyboard activity @constraints  boolean:
          autoclose?: boolean;
          // Time before closing (ms) @constraints  number: mode: box, step: 1
          timeout?: number;
          // Action to perform when popup is closed by timeout @constraints  object: multiple: false
          timeout_action?: object;
          // Hide timeout progress bar @constraints  boolean:
          timeout_hide_progress?: boolean;
          // Tag for managing multiple popups
          tag?: string;
        }
      >;
      // Show more-info dialog
      moreInfo: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          //
          entity?: string;
          // More-info view to show
          view?: "info" | "history" | "settings" | "related";
          //  @constraints  boolean:
          large?: boolean;
          //  @constraints  boolean:
          ignore_popup_card?: boolean;
          // Close the more-info dialog if open @constraints  boolean:
          close?: boolean;
        }
      >;
      // Close a popup
      closePopup: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // Close all Browser Mod popups on the browser @constraints  boolean:
          all?: boolean;
          // Tag for popup to close when using multiple popups
          tag?: string;
        }
      >;
      // Set the style of a popup
      setPopupStyle: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // Set style for all open Browser Mod popups on the browser @constraints  boolean:
          all?: boolean;
          // Tag for popup to set style for when using multiple popups
          tag?: string;
          // Style to apply to the popup
          style?: "normal" | "classic" | "wide" | "fullscreen";
          // Direction to cycle through style sequence
          direction?: "forward" | "back";
        }
      >;
      // Display a short notification
      notification: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // Message to display
          message: string;
          // Time before closing (ms) @constraints  number: mode: box, step: 1
          duration?: number;
          // Text of optional action button
          action_text?: string;
          // Action to perform when the action button is pressed @constraints  object: multiple: false
          action?: object;
        }
      >;
      // Navigate browser to a different page
      navigate: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // Target path
          path?: string;
        }
      >;
      // Refresh page
      refresh: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
        }
      >;
      // Change browser ID
      changeBrowserId: ServiceFunction<
        object,
        T,
        {
          // Current Browser ID of the browser to change
          current_browser_id?: string;
          // New Browser ID for the browser
          new_browser_id?: string;
          // Register the browser @constraints  boolean:
          register?: boolean;
          // Refresh the browser after changing the ID @constraints  boolean:
          refresh?: boolean;
        }
      >;
      // Change the current theme
      setTheme: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // Name of theme or 'auto'
          theme?: string;
          // Dark/light mode
          dark?: "auto" | "light" | "dark";
          // Primary theme color @constraints  color_rgb:
          primaryColor?: unknown;
          // Accent theme color @constraints  color_rgb:
          accentColor?: unknown;
        }
      >;
      // Print text to browser console
      console: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // Text to print
          message?: string;
        }
      >;
      // Run arbitrary JavaScript code
      javascript: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          //
          user_id?: string;
          // JavaScript code to run @constraints  object: multiple: false
          code?: object;
        }
      >;
      // Deregister a browser. Include at leaset one paremeter. Calling wiith either exclude parameter will deregister all browsers except those excluded.
      deregisterBrowser: ServiceFunction<
        object,
        T,
        {
          //
          browser_id?: string;
          // Exclude browser from deregister
          browser_id_exclude?: string;
          // Exclude browsers in area from deregister @constraints  area: multiple: true, entity: [object Object]
          area_id_exclude?: unknown;
        }
      >;
    };
    googlePhotos: {
      // undefined
      upload: ServiceFunction<
        object,
        T,
        {
          //  @constraints  config_entry: integration: google_photos
          config_entry_id: unknown;
          //  @constraints  object: multiple: false
          filename?: object;
          //
          album: string;
        }
      >;
    };
    todo: {
      // undefined
      addItem: ServiceFunction<
        object,
        T,
        {
          //  @example Submit income tax return
          item: string;
          //  @example 2023-11-17 @constraints  date:
          due_date?: string;
          //  @example 2023-11-17 13:30:00 @constraints  datetime:
          due_datetime?: string;
          //  @example A more complete description of the to-do item than that provided by the summary.
          description?: string;
        }
      >;
      // undefined
      updateItem: ServiceFunction<
        object,
        T,
        {
          //  @example Submit income tax return
          item: string;
          //  @example Something else
          rename?: string;
          //  @example needs_action
          status?: "needs_action" | "completed";
          //  @example 2023-11-17 @constraints  date:
          due_date?: string;
          //  @example 2023-11-17 13:30:00 @constraints  datetime:
          due_datetime?: string;
          //  @example A more complete description of the to-do item than that provided by the summary.
          description?: string;
        }
      >;
      // undefined
      removeItem: ServiceFunction<
        object,
        T,
        {
          //  @example Submit income tax return
          item: string;
        }
      >;
      // undefined
      getItems: ServiceFunction<
        object,
        T,
        {
          //  @example needs_action
          status?: "needs_action" | "completed";
        }
      >;
      // undefined
      removeCompletedItems: ServiceFunction<object, T, object>;
    };
    notify: {
      // undefined
      sendMessage: ServiceFunction<
        object,
        T,
        {
          //
          message: string;
          //
          title?: string;
        }
      >;
      // undefined
      persistentNotification: ServiceFunction<
        object,
        T,
        {
          //  @example The garage door has been open for 10 minutes.
          message: string;
          //  @example Your Garage Door Friend
          title?: string;
          //  @example platform specific @constraints  object: multiple: false
          data?: object;
        }
      >;
      // Sends a notification message using the mobile_app_sm_t550 integration.
      mobileAppSmT550: ServiceFunction<
        object,
        T,
        {
          //  @example The garage door has been open for 10 minutes.
          message: string;
          //  @example Your Garage Door Friend
          title?: string;
          //  @example platform specific
          target?: object;
          //  @example platform specific
          data?: object;
        }
      >;
      // Sends a notification message using the mobile_app_alices_mobil integration.
      mobileAppAlicesMobil: ServiceFunction<
        object,
        T,
        {
          //  @example The garage door has been open for 10 minutes.
          message: string;
          //  @example Your Garage Door Friend
          title?: string;
          //  @example platform specific
          target?: object;
          //  @example platform specific
          data?: object;
        }
      >;
      // Sends a notification message using the mobile_app_vog_l29 integration.
      mobileAppVogL29: ServiceFunction<
        object,
        T,
        {
          //  @example The garage door has been open for 10 minutes.
          message: string;
          //  @example Your Garage Door Friend
          title?: string;
          //  @example platform specific
          target?: object;
          //  @example platform specific
          data?: object;
        }
      >;
      // Sends a notification message using the notify service.
      notify: ServiceFunction<
        object,
        T,
        {
          //  @example The garage door has been open for 10 minutes.
          message: string;
          //  @example Your Garage Door Friend
          title?: string;
          //  @example platform specific
          target?: object;
          //  @example platform specific
          data?: object;
        }
      >;
      // Sends a notification message using the mobile_app_jerrys_mobil integration.
      mobileAppJerrysMobil: ServiceFunction<
        object,
        T,
        {
          //  @example The garage door has been open for 10 minutes.
          message: string;
          //  @example Your Garage Door Friend
          title?: string;
          //  @example platform specific
          target?: object;
          //  @example platform specific
          data?: object;
        }
      >;
    };
    deviceTracker: {
      // undefined
      see: ServiceFunction<
        object,
        T,
        {
          //  @example FF:FF:FF:FF:FF:FF
          mac?: string;
          //  @example phonedave
          dev_id?: string;
          //  @example Dave
          host_name?: string;
          //  @example home
          location_name?: string;
          //  @example [51.509802, -0.086692] @constraints  object: multiple: false
          gps?: object;
          //  @constraints  number: min: 0, mode: box, unit_of_measurement: m, step: 1
          gps_accuracy?: number;
          //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
          battery?: number;
        }
      >;
    };
    aiTask: {
      // undefined
      generateData: ServiceFunction<
        object,
        T,
        {
          //  @example home summary
          task_name: string;
          //  @example Generate a funny notification that the garage door was left open
          instructions: string;
          //
          entity_id?: string;
          //  @example { 'name': { 'selector': { 'text': }, 'description': 'Name of the user', 'required': 'True' } } }, 'age': { 'selector': { 'number': }, 'description': 'Age of the user' } } @constraints  object: multiple: false
          structure?: object;
          //  @constraints  media: accept: *, multiple: true
          attachments?: unknown;
        }
      >;
      // undefined
      generateImage: ServiceFunction<
        object,
        T,
        {
          //  @example picture of a dog
          task_name: string;
          //  @example Generate a high quality square image of a dog on transparent background
          instructions: string;
          //
          entity_id: string;
          //  @constraints  media: accept: *, multiple: true
          attachments?: unknown;
        }
      >;
    };
    weather: {
      // undefined
      getForecasts: ServiceFunction<
        object,
        T,
        {
          //
          type: "daily" | "hourly" | "twice_daily";
        }
      >;
    };
    cover: {
      // undefined
      openCover: ServiceFunction<object, T, object>;
      // undefined
      closeCover: ServiceFunction<object, T, object>;
      // undefined
      setCoverPosition: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
          position: number;
        }
      >;
      // undefined
      stopCover: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
      // undefined
      openCoverTilt: ServiceFunction<object, T, object>;
      // undefined
      closeCoverTilt: ServiceFunction<object, T, object>;
      // undefined
      stopCoverTilt: ServiceFunction<object, T, object>;
      // undefined
      setCoverTiltPosition: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
          tilt_position: number;
        }
      >;
      // undefined
      toggleCoverTilt: ServiceFunction<object, T, object>;
    };
    climate: {
      // undefined
      turnOn: ServiceFunction<object, T, object>;
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
      // undefined
      setHvacMode: ServiceFunction<
        object,
        T,
        {
          //  @constraints  state: hide_states: unavailable,unknown, multiple: false
          hvac_mode?: unknown;
        }
      >;
      // undefined
      setPresetMode: ServiceFunction<
        object,
        T,
        {
          //  @example away
          preset_mode: string;
        }
      >;
      // undefined
      setTemperature: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 0, max: 250, step: 0.1, mode: box
          temperature?: number;
          //  @constraints  number: min: 0, max: 250, step: 0.1, mode: box
          target_temp_high?: number;
          //  @constraints  number: min: 0, max: 250, step: 0.1, mode: box
          target_temp_low?: number;
          //
          hvac_mode?:
            | "off"
            | "auto"
            | "cool"
            | "dry"
            | "fan_only"
            | "heat_cool"
            | "heat";
        }
      >;
      // undefined
      setHumidity: ServiceFunction<
        object,
        T,
        {
          //  @constraints  number: min: 30, max: 99, unit_of_measurement: %, step: 1, mode: slider
          humidity: number;
        }
      >;
      // undefined
      setFanMode: ServiceFunction<
        object,
        T,
        {
          //  @example low
          fan_mode: string;
        }
      >;
      // undefined
      setSwingMode: ServiceFunction<
        object,
        T,
        {
          //  @example on
          swing_mode: string;
        }
      >;
      // undefined
      setSwingHorizontalMode: ServiceFunction<
        object,
        T,
        {
          //  @example on
          swing_horizontal_mode: string;
        }
      >;
    };
    number: {
      // undefined
      setValue: ServiceFunction<
        object,
        T,
        {
          //  @example 42
          value: string;
        }
      >;
    };
    calendar: {
      // undefined
      createEvent: ServiceFunction<
        object,
        T,
        {
          //  @example Department Party
          summary: string;
          //  @example Meeting to provide technical review for 'Phoenix' design.
          description?: string;
          //  @example 2022-03-22 20:00:00 @constraints  datetime:
          start_date_time?: string;
          //  @example 2022-03-22 22:00:00 @constraints  datetime:
          end_date_time?: string;
          //  @example 2022-03-22 @constraints  date:
          start_date?: string;
          //  @example 2022-03-23 @constraints  date:
          end_date?: string;
          //  @example {'days': 2} or {'weeks': 2}
          in?: object;
          //  @example Conference Room - F123, Bldg. 002
          location?: string;
        }
      >;
      // undefined
      getEvents: ServiceFunction<
        object,
        T,
        {
          //  @example 2022-03-22 20:00:00 @constraints  datetime:
          start_date_time?: string;
          //  @example 2022-03-22 22:00:00 @constraints  datetime:
          end_date_time?: string;
          //  @constraints  duration:
          duration?: {
            hours?: number;
            days?: number;
            minutes?: number;
            seconds?: number;
          };
        }
      >;
    };
    google: {
      // undefined
      createEvent: ServiceFunction<
        object,
        T,
        {
          //  @example Bowling
          summary: string;
          //  @example Birthday bowling
          description?: string;
          //  @example 2022-03-22 20:00:00
          start_date_time?: string;
          //  @example 2022-03-22 22:00:00
          end_date_time?: string;
          //  @example 2022-03-10
          start_date?: string;
          //  @example 2022-03-11
          end_date?: string;
          //  @example 'days': 2 or 'weeks': 2 @constraints  object: multiple: false
          in?: object;
          //  @example Conference Room - F123, Bldg. 002
          location?: string;
        }
      >;
    };
    button: {
      // undefined
      press: ServiceFunction<object, T, object>;
    };
    image: {
      // undefined
      snapshot: ServiceFunction<
        object,
        T,
        {
          //  @example /tmp/image_snapshot.jpg
          filename: string;
        }
      >;
    };
    tapoControl: {
      // Saves the current PTZ position to a preset
      savePreset: ServiceFunction<
        object,
        T,
        {
          // Name of the preset. @example Entry Door
          name: string;
        }
      >;
      // Deletes a preset
      deletePreset: ServiceFunction<
        object,
        T,
        {
          // PTZ preset ID or a Name. See possible presets in entity attributes @example 1
          preset: string;
        }
      >;
    };
    select: {
      // undefined
      selectFirst: ServiceFunction<object, T, object>;
      // undefined
      selectLast: ServiceFunction<object, T, object>;
      // undefined
      selectNext: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          cycle?: boolean;
        }
      >;
      // undefined
      selectOption: ServiceFunction<
        object,
        T,
        {
          //  @example 'Item A' @constraints  state: hide_states: unavailable,unknown, multiple: false
          option: unknown;
        }
      >;
      // undefined
      selectPrevious: ServiceFunction<
        object,
        T,
        {
          //  @constraints  boolean:
          cycle?: boolean;
        }
      >;
    };
    siren: {
      // undefined
      turnOn: ServiceFunction<
        object,
        T,
        {
          //  @example fire
          tone?: string;
          //  @example 0.5 @constraints  number: min: 0, max: 1, step: 0.05, mode: slider
          volume_level?: number;
          //  @example 15
          duration?: string;
        }
      >;
      // undefined
      turnOff: ServiceFunction<object, T, object>;
      // undefined
      toggle: ServiceFunction<object, T, object>;
    };
  }
  export interface CustomEntityNameContainer {
    names:
      | "update.home_assistant_supervisor_update"
      | "update.home_assistant_core_update"
      | "update.studio_code_server_uppdatering"
      | "update.samba_share_uppdatering"
      | "update.advanced_ssh_web_terminal_uppdatering"
      | "update.whisper_uppdatering"
      | "update.piper_uppdatering"
      | "update.openwakeword_uppdatering"
      | "update.duck_dns_uppdatering"
      | "update.home_assistant_mcp_server_dev_uppdatering"
      | "update.home_assistant_operating_system_update"
      | "conversation.home_assistant"
      | "event.backup_automatic_backup"
      | "sensor.backup_backup_manager_state"
      | "sensor.backup_next_scheduled_automatic_backup"
      | "sensor.backup_last_successful_automatic_backup"
      | "sensor.backup_last_attempted_automatic_backup"
      | "zone.skolan"
      | "zone.home"
      | "person.jerry"
      | "person.tablet"
      | "person.alice"
      | "person.linnea"
      | "sun.sun"
      | "sensor.sun_next_dawn"
      | "sensor.sun_next_dusk"
      | "sensor.sun_next_midnight"
      | "sensor.sun_next_noon"
      | "sensor.sun_next_rising"
      | "sensor.sun_next_setting"
      | "todo.inkopslista"
      | "binary_sensor.jerrys_mobil_power_save"
      | "device_tracker.oneplus_12r"
      | "sensor.jerrys_mobil_detected_activity"
      | "sensor.jerrys_mobil_ringer_mode"
      | "sensor.jerrys_mobil_battery_level"
      | "sensor.jerrys_mobil_battery_state"
      | "sensor.jerrys_mobil_geocoded_location"
      | "sensor.jerrys_mobil_wi_fi_connection"
      | "device_tracker.sm_t550"
      | "sensor.sm_t550_battery_level"
      | "sensor.sm_t550_battery_state"
      | "sensor.sm_t550_charger_type"
      | "binary_sensor.alices_mobil_is_charging"
      | "binary_sensor.alices_mobil_interactive"
      | "binary_sensor.alices_mobil_power_save"
      | "device_tracker.alices_mobil"
      | "sensor.alices_mobil_detected_activity"
      | "sensor.alices_mobil_ringer_mode"
      | "sensor.alices_mobil_audio_mode"
      | "sensor.alices_mobil_battery_level"
      | "sensor.alices_mobil_battery_state"
      | "sensor.alices_mobil_charger_type"
      | "sensor.alices_mobil_battery_health"
      | "sensor.alices_mobil_battery_temperature"
      | "sensor.alices_mobil_battery_power"
      | "sensor.alices_mobil_remaining_charge_time"
      | "sensor.alices_mobil_geocoded_location"
      | "sensor.alices_mobil_wi_fi_connection"
      | "sensor.alices_mobil_network_type"
      | "sensor.alices_mobil_steps_sensor"
      | "binary_sensor.vog_l29_power_save"
      | "device_tracker.vog_l29"
      | "sensor.vog_l29_detected_activity"
      | "sensor.vog_l29_audio_mode"
      | "sensor.vog_l29_battery_level"
      | "sensor.vog_l29_battery_state"
      | "sensor.vog_l29_geocoded_location"
      | "sensor.vog_l29_wi_fi_connection"
      | "tts.google_translate_en_com"
      | "media_player.kokets_hogtalare"
      | "ai_task.openai_ai_task"
      | "conversation.openai_conversation"
      | "wake_word.openwakeword"
      | "tts.piper"
      | "stt.faster_whisper"
      | "weather.forecast_hem"
      | "update.layout_card_update"
      | "update.hacs_update"
      | "update.tapo_cameras_control_update"
      | "update.meteogram_card_update"
      | "update.card_mod_update"
      | "update.browser_mod_update"
      | "update.button_card_update"
      | "update.calendar_card_pro_update"
      | "update.plejd_update"
      | "binary_sensor.rt_ac2900_5888_asus_router_wan_status"
      | "sensor.rt_ac2900_5888_asus_router_extern_ip"
      | "sensor.rt_ac2900_5888_asus_router_nedladdningshastighet"
      | "sensor.rt_ac2900_5888_asus_router_uppladdningshastighet"
      | "todo.dev"
      | "media_player.alice_s_hogtalare"
      | "calendar.jerry_olsson_kalender_canvas"
      | "calendar.kraver_uppgradering"
      | "calendar.ojebyn_weather"
      | "calendar.helgdagar_i_sverige"
      | "calendar.family"
      | "calendar.myold"
      | "calendar.alice"
      | "calendar.linnea"
      | "calendar.oliver"
      | "calendar.ohlson_mailen_gmail_com"
      | "calendar.fodelsedagar"
      | "calendar.https_home_tempusinfo_se_tempushome_icalservlet_id_aa535f12ca104f209bfa7ae5b2577f65_s_19"
      | "calendar.fodelsedagar_2"
      | "light.spottar_matsalen"
      | "switch.may_be_gateway"
      | "binary_sensor.is_gateway"
      | "binary_sensor.is_connectable"
      | "sensor.last_seen"
      | "sensor.rssi"
      | "light.spottar_vardagsrum"
      | "switch.may_be_gateway_2"
      | "binary_sensor.is_gateway_2"
      | "binary_sensor.is_connectable_2"
      | "sensor.last_seen_2"
      | "sensor.rssi_2"
      | "light.spottar_bibliotek"
      | "switch.may_be_gateway_3"
      | "binary_sensor.is_gateway_3"
      | "binary_sensor.is_connectable_3"
      | "sensor.last_seen_3"
      | "sensor.rssi_3"
      | "light.soffbord"
      | "switch.may_be_gateway_4"
      | "binary_sensor.is_gateway_4"
      | "binary_sensor.is_connectable_4"
      | "sensor.last_seen_4"
      | "sensor.rssi_4"
      | "light.barbord"
      | "switch.may_be_gateway_5"
      | "binary_sensor.is_gateway_5"
      | "binary_sensor.is_connectable_5"
      | "sensor.last_seen_5"
      | "sensor.rssi_5"
      | "light.bibliotek_taklampa"
      | "switch.may_be_gateway_6"
      | "binary_sensor.is_gateway_6"
      | "binary_sensor.is_connectable_6"
      | "sensor.last_seen_6"
      | "sensor.rssi_6"
      | "light.kokslampa"
      | "switch.may_be_gateway_7"
      | "binary_sensor.is_gateway_7"
      | "binary_sensor.is_connectable_7"
      | "sensor.last_seen_7"
      | "sensor.rssi_7"
      | "event.spottar_matsalen_1_pressed"
      | "event.spottar_matsalen_2_pressed"
      | "event.spottar_matsalen_3_pressed"
      | "event.spottar_vardagsrum_1_pressed"
      | "event.spottar_vardagsrum_2_pressed"
      | "event.spottar_vardagsrum_3_pressed"
      | "event.spottar_bibliotek_1_pressed"
      | "event.spottar_bibliotek_2_pressed"
      | "event.spottar_bibliotek_3_pressed"
      | "event.barbord_1_pressed"
      | "event.barbord_2_pressed"
      | "event.barbord_3_pressed"
      | "event.soffbord_1_pressed"
      | "event.soffbord_2_pressed"
      | "event.soffbord_3_pressed"
      | "event.kokslampa_1_pressed"
      | "event.kokslampa_2_pressed"
      | "event.kokslampa_3_pressed"
      | "event.bibliotek_taklampa_1_pressed"
      | "event.bibliotek_taklampa_2_pressed"
      | "event.bibliotek_taklampa_3_pressed"
      | "scene.allt_av"
      | "event.allt_av_activated"
      | "event.god_morgon_vardag_activated"
      | "scene.kvallsmys"
      | "event.kvallsmys_activated"
      | "scene.allt_pa"
      | "event.allt_pa_activated"
      | "scene.morgon"
      | "event.morgon_activated"
      | "event.sangdax_activated"
      | "scene.dag"
      | "event.dag_activated"
      | "media_player.google_tv"
      | "camera.utomhus_hd_stream"
      | "camera.utomhus_sd_stream"
      | "button.utomhus_reboot"
      | "button.utomhus_format_sd_card"
      | "button.utomhus_manual_alarm_start"
      | "button.utomhus_manual_alarm_stop"
      | "button.utomhus_sync_time"
      | "button.utomhus_calibrate"
      | "button.utomhus_move_up"
      | "button.utomhus_move_down"
      | "button.utomhus_move_right"
      | "button.utomhus_move_left"
      | "number.utomhus_movement_angle"
      | "number.utomhus_motion_detection_digital_sensitivity"
      | "number.utomhus_microphone_volume"
      | "number.utomhus_speaker_volume"
      | "number.utomhus_siren_volume"
      | "number.utomhus_siren_duration"
      | "number.utomhus_spotlight_intensity"
      | "select.utomhus_timezone"
      | "select.utomhus_night_vision_switching"
      | "select.utomhus_night_vision"
      | "select.utomhus_light_frequency"
      | "select.utomhus_automatic_alarm"
      | "select.utomhus_siren_type"
      | "select.utomhus_motion_detection"
      | "select.utomhus_person_detection"
      | "select.utomhus_vehicle_detection"
      | "select.utomhus_pet_detection"
      | "select.utomhus_tamper_detection"
      | "select.utomhus_move_to_preset"
      | "select.utomhus_patrol_mode"
      | "select.utomhus_spotlight_on_off_for"
      | "siren.utomhus_siren"
      | "update.utomhus_update"
      | "binary_sensor.utomhus_noise"
      | "sensor.utomhus_network_ssid"
      | "sensor.utomhus_link_type"
      | "sensor.utomhus_rssi"
      | "sensor.utomhus_recordings_synchronization"
      | "switch.utomhus_privacy"
      | "switch.utomhus_trigger_alarm_on_people_detection"
      | "switch.utomhus_trigger_alarm_on_motion_detection"
      | "switch.utomhus_trigger_alarm_on_tamper_detection"
      | "switch.utomhus_trigger_alarm_on_linecrossing_detection"
      | "switch.utomhus_trigger_alarm_on_vehicle_detection"
      | "switch.utomhus_trigger_alarm_on_pet_detection"
      | "switch.utomhus_media_sync"
      | "switch.utomhus_lens_distortion_correction"
      | "switch.utomhus_indicator_led"
      | "switch.utomhus_record_audio"
      | "switch.utomhus_diagnose_mode"
      | "switch.utomhus_smart_track_people"
      | "switch.utomhus_smart_track_pet"
      | "switch.utomhus_smart_track_vehicle"
      | "switch.utomhus_smart_track_baby"
      | "switch.utomhus_privacy_zones"
      | "switch.utomhus_flip"
      | "switch.utomhus_auto_track"
      | "switch.utomhus_notifications"
      | "switch.utomhus_rich_notifications"
      | "switch.utomhus_automatically_upgrade_firmware"
      | "switch.utomhus_record_to_sd_card"
      | "switch.utomhus_microphone_mute"
      | "switch.utomhus_microphone_noise_cancellation"
      | "light.utomhus_floodlight_timed"
      | "binary_sensor.utomhus_person_detection"
      | "binary_sensor.utomhus_pet_detection"
      | "binary_sensor.utomhus_person_detection_2"
      | "binary_sensor.utomhus_pet_detection_2"
      | "binary_sensor.samsung_galaxy_tab_a_kiosklage"
      | "binary_sensor.samsung_galaxy_tab_a_inkopplad"
      | "binary_sensor.samsung_galaxy_tab_a_enhetsadministrator"
      | "button.samsung_galaxy_tab_a_starta_om_webblasaren"
      | "button.samsung_galaxy_tab_a_starta_om_enheten"
      | "button.samsung_galaxy_tab_a_ta_fram_i_forgrunden"
      | "button.samsung_galaxy_tab_a_skicka_till_bakgrunden"
      | "button.samsung_galaxy_tab_a_las_in_start_url"
      | "button.samsung_galaxy_tab_a_rensa_webblasarens_cache"
      | "camera.samsung_galaxy_tab_a"
      | "image.samsung_galaxy_tab_a_skarmdump"
      | "media_player.samsung_galaxy_tab_a"
      | "notify.samsung_galaxy_tab_a_overlagrad_avisering"
      | "notify.samsung_galaxy_tab_a_text_till_tal"
      | "number.samsung_galaxy_tab_a_timer_for_skarmslackare"
      | "number.samsung_galaxy_tab_a_skarmslackarens_ljusstyrka"
      | "number.samsung_galaxy_tab_a_timer_for_avstangning_av_skarm"
      | "number.samsung_galaxy_tab_a_skarmens_ljusstyrka"
      | "sensor.samsung_galaxy_tab_a_batteri"
      | "sensor.samsung_galaxy_tab_a_aktuell_sida"
      | "sensor.samsung_galaxy_tab_a_skarmorientering"
      | "sensor.samsung_galaxy_tab_a_app_for_forgrund"
      | "sensor.samsung_galaxy_tab_a_ledigt_utrymme_for_intern_lagring"
      | "sensor.samsung_galaxy_tab_a_totalt_utrymme_for_intern_lagring"
      | "sensor.samsung_galaxy_tab_a_ledigt_minne"
      | "sensor.samsung_galaxy_tab_a_totalt_minne"
      | "switch.samsung_galaxy_tab_a_skarmslackare"
      | "switch.samsung_galaxy_tab_a_underhallslage"
      | "switch.samsung_galaxy_tab_a_kiosk_las"
      | "switch.samsung_galaxy_tab_a_rorelsedetektering"
      | "switch.samsung_galaxy_tab_a_skarm"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_id"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_path"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_visibility"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_useragent"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_user"
      | "binary_sensor.browser_mod_77be7c4a_3772bf82_browser_fullykiosk"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_width"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_height"
      | "binary_sensor.browser_mod_77be7c4a_3772bf82_browser_dark_mode"
      | "binary_sensor.browser_mod_77be7c4a_3772bf82"
      | "light.browser_mod_77be7c4a_3772bf82_screen"
      | "media_player.browser_mod_77be7c4a_3772bf82"
      | "sensor.browser_mod_77be7c4a_3772bf82_panel"
      | "sensor.browser_mod_77be7c4a_3772bf82_browser_battery"
      | "binary_sensor.browser_mod_77be7c4a_3772bf82_browser_charging"
      | "input_select.jerry_ringer_mode"
      | "input_select.alice_ringer_mode"
      | "person.oliver"
      | "sensor.jerrys_mobil_last_update_trigger";
  }
}
