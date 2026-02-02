# 🌍 Dot CLI

> Descubre qué hay cerca de ti desde tu terminal

Dot CLI es la herramienta oficial de línea de comandos para [Dot](https://hidot.social), la red social basada en ubicación. Publica y descubre contenido geolocalizado sin salir de tu terminal.

## Instalación

```bash
npm install -g @aitorsola/dot-cli
```

## Configuración

Antes de usar Dot CLI, necesitas configurar tu API Key:

```bash
dot setup <tu-api-key>
```

Puedes obtener tu API Key en [hidot.social/settings/api](https://www.hidot.social/user/me/edit).

## Comandos

### `dot near`

Muestra los posts cercanos a tu ubicación (detectada automáticamente por IP).

```bash
dot near
```

**Output:**

```
══════════════════════════════════════════════════
  📍 Madrid, Spain
     40.4168, -3.7038
══════════════════════════════════════════════════

  Mostrando 3 posts:

  Alguien sabe un buen sitio para comer por aquí?
  Carlos García @carlos
  ──────────────────────────────────────────────
  El nuevo café de la esquina está genial ☕
  María López @maria
  ──────────────────────────────────────────────
  Quedada esta tarde en el parque!
  @anonymous

══════════════════════════════════════════════════
```

## Requisitos

- Node.js 18+
- Una cuenta en [Dot](https://www.hidot.social)

## Tecnologías

- [Commander.js](https://github.com/tj/commander.js) - Framework CLI
- [Chalk](https://github.com/chalk/chalk) - Colores en terminal
- [Axios](https://github.com/axios/axios) - Cliente HTTP
- [Day.js](https://github.com/iamkun/dayjs) - Formateo de fechas
- [wrap-ansi](https://github.com/chalk/wrap-ansi) - Text wrapping

## Licencia

MIT © [Aitor Sola]

---

<p align="center">
  Hecho con ❤️ para la comunidad de <a href="https://www.hidot.social">Dot</a>
</p>
