# Pomodogod - Gamificado (Extensión)

Se agregó funcionalidad de Pomodoro gamificado con Firebase.

## Requisitos
- Node + npm
- Cuenta Firebase (Firestore + Auth email/password)
- Expo CLI (npx expo)

## Variables de entorno (.env)
(No incluir secretos en commits)

```
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project
EXPO_PUBLIC_FIREBASE_APP_ID=1:xxxx:web:yyyy
```

## Instalación
1. Crear `.env` con los valores arriba.
2. Instalar dependencias:
```
npm i firebase expo-secure-store expo-notifications zustand immer date-fns react-native-svg
npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier
```
3. Ejecutar:
```
npx expo start
```

## Lógica XP / Niveles / Monedas
- Base XP por Pomodoro: 50
- Bonus racha: +2 XP por día de racha (máx +20)
- Monedas: 5 por sesión de trabajo completada
- Nivel: `level = floor((xp/100)^0.65) + 1`
- Barra de progreso calculada con xpProgress.

## Flujo de primer login
1. Ir a Ajustes → Crear Cuenta.
2. Completar un Pomodoro de trabajo → se genera sesión + XP/monedas.
3. Comprar ítems en Shop y equipar en Avatar.

## Notificaciones
Se solicita permiso al iniciar la pantalla de Timer. Al completar un ciclo se dispara notificación local.

## Firestore
Colecciones:
- `users/{uid}`
- `sessions/{autoId}`
- `inventory/{autoId}`

Reglas en `firestore.rules` (deploy manual).

## Costos
- Lecturas: perfil + inventario bajo demanda. Escritura sólo al completar Pomodoro o comprar equipamiento.
- Se usan converters manuales.

## Próximos pasos sugeridos
- Agregar paginación completa para sesiones.
- Sincronizar avatar equipado en perfil para render único.
- Añadir tests y analytics.

## Estructura del Proyecto

```
app/
	_layout.tsx
	(tabs)/
		_layout.tsx
		index.tsx        (Timer)
		avatar.tsx
		shop.tsx
		stats.tsx
		settings.tsx
assets/
	images/ (iconos referenciados en app.json)
src/
	components/
	hooks/
	services/
	store/
	styles/
	types/
	utils/
firestore.rules
.env (no commitear secretos)
```

## Scripts disponibles

```
npm run dev          # Inicia Expo
npm run typecheck    # Comprobación TypeScript
npm run lint         # Linter
npm run format       # Formatea con Prettier
npm run clean:node   # Elimina node_modules y lock
npm run reinstall    # Limpia e instala de nuevo
```

## Convenciones
- Código de negocio en `src/`.
- Rutas y navegación en `app/`.
- Nada de lógica dentro de archivos de ruta salvo orquestación mínima.
- Estado global: Zustand en `src/store`.
- Servicios externos / Firebase en `src/services`.
- Utilidades puras en `src/utils`.

## Mantenimiento
- Ejecutar `npm run typecheck` antes de subir cambios.
- Alinear estilos con `npm run format`.
- Revisar reglas de Firestore tras cambios de modelo.
