<div align="center">

# Pomodogod ⏱️🐾  
Una app Pomodoro gamificada construida con Expo Router, Firebase y React Native.

![License](https://img.shields.io/badge/license-MIT-green)
![Expo](https://img.shields.io/badge/Expo-54-black)
![React%20Native](https://img.shields.io/badge/React%20Native-0.81-blue)

</div>

## ✨ Descripción
Pomodogod combina la técnica Pomodoro con progresión tipo RPG: XP, niveles, monedas, logros, rarezas y personalización de avatar. Diseñada para mantener motivación a largo plazo con métricas claras y feedback visual.

## 🧩 Características
- Temporizador Pomodoro (trabajo, descanso corto, descanso largo)
- Sistema de XP, nivel y progresión dinámica
- Monedas por sesión completada y tienda de ítems cosméticos
- Inventario + equipamiento de avatar (fondo, outfit, accesorio, etc.)
- Logros con rarezas (común → legendario), progreso y recompensas de XP
- Migración automática para usuarios previos (retro‑XP de logros)
- Rachas diarias y minutos totales de enfoque
- Animaciones (Reanimated) y confetti al desbloquear
- Modo seguro con Firebase Auth + Firestore
- Arquitectura modular (stores, services, utils)

## 🏗️ Stack Principal
| Capa | Tecnología |
|------|------------|
| UI / Navegación | Expo Router + React Native |
| Estado | Zustand + Immer |
| Backend as a Service | Firebase (Auth, Firestore) |
| Animaciones | Reanimated |
| Notificaciones | expo-notifications |
| Tipado | TypeScript |

## ⚙️ Requisitos Previos
- Node.js LTS
- Cuenta Firebase (proyecto con Auth Email/Password + Firestore habilitado)
- `npx expo` (CLI) para desarrollo local

## 🔐 Variables de Entorno
Crear un archivo `.env` (no lo publiques) con:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=XXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=XXXX.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=XXXX
EXPO_PUBLIC_FIREBASE_APP_ID=1:XXXX:web:YYYY
```

## 🚀 Instalación Rápida
```bash
git clone https://github.com/usuario/pomodogod.git
cd pomodogod
npm install
cp .env.example .env   # (si agregás un template)
npx expo start
```

## ▶️ Uso Básico
1. Registra una cuenta (o inicia sesión).
2. Inicia una sesión de trabajo (Pomodoro).
3. Al completar: obtienes XP + monedas.
4. Compra y equipa ítems en la tienda.
5. Desbloqueá logros y subí de nivel.

## 🧮 Fórmulas Clave
| Concepto | Fórmula / Detalle |
|----------|-------------------|
| XP base por sesión | 50 |
| Bonus de racha | +2 XP * día (máx +20) |
| Nivel | `floor((xp/100)^0.65) + 1` |
| Monedas por sesión | 5 (sólo work) |
| Progreso de nivel | cálculo mediante `xpProgress(xp)` |

## 🗂️ Estructura del Proyecto (resumen)
```
app/              # Rutas (Expo Router)
  (protected)/    # Secciones autenticadas
  (auth)/         # Login / registro
src/
  components/     # UI reutilizable
  hooks/          # Hooks (auth listener, temas, etc.)
  services/       # Firestore / lógica de dominio
  store/          # Zustand stores
  utils/          # Helpers puros (xp, rarity, etc.)
  constants/      # Definiciones (logros, colores)
assets/           # Fuentes / imágenes
```

## 🗃️ Modelo de Datos (Firestore simplificado)
| Colección | Documento | Campos relevantes |
|-----------|-----------|-------------------|
| users | {uid} | xp, level, coins, streakDays, sessionsCount, longestStreak, totalWorkMinutes, achievementsUnlocked[], achievementsXpTotal |
| sessions | autoId | uid, startedAt, endedAt, durationSec, type, completed |
| inventory | autoId | uid, itemId, category, equipped |

## 🏆 Logros y Rarezas
- Cada logro define: `metric`, `target`, `xpReward`, `rarity`.
- Progreso calculado dinámicamente (`current / target`).
- Rarezas: común, poco-común, raro, épico, legendario.
- Migración: usuarios antiguos reciben XP retroactiva una única vez (marcada por `achievementsXpTotal`).

## 🔄 Migraciones Automáticas
Al iniciar sesión:
1. Se asegura el perfil.
2. Si falta `achievementsXpTotal`, se calcula y suma XP retroactiva.
3. Se recalcula el nivel.
4. Se refresca el estado local.

## 🧪 Scripts
```bash
npm run dev          # Inicia servidor Expo
npm run typecheck    # Revisa tipos
npm run lint         # ESLint
npm run format       # Prettier
npm run clean:node   # Borra node_modules y lock
npm run reinstall    # Limpia e instala
```

## ✅ Buenas Prácticas Adoptadas
- Conversores Firestore tipados para evitar casting repetido.
- Stores pequeños y enfocados (user, pomodoro, inventory, theme...).
- Funciones puras en `utils/` (fácil de testear / migrar a server si hiciera falta).
- Cálculos de progreso y nivel centralizados.

## 🗺️ Roadmap (Ideas futuras)
- Modo Focus “sin distracciones”.
- Más categorías de ítems cosméticos.
- Leaderboards (top rachas / XP).
- Sincronización offline-first.
- Tests E2E (Detox) y métricas de retención.

## 🤝 Contribuciones
Se aceptan PRs con mejoras de rendimiento, limpieza o nuevas integraciones. Por favor incluye descripción clara y evita introducir dependencias pesadas sin discusión previa.

## 🛡️ Licencia
MIT. Puedes usar, modificar y distribuir. Revisa `LICENSE` (si se añade) para más detalles.

## ⚠️ Notas
- No incluyas el archivo `.env` en commits ni compartas tus claves públicas/privadas.
- Ajusta reglas de seguridad de Firestore antes de producción.

---
¿Te resulta útil? Estrellas en el repo ayudan a que más gente lo encuentre ✨
