# 🔄 Actualizar Deployment en Netlify

Tu dominio **https://potentiamx.com** ya está funcionando. Esta guía te ayudará a deployar las nuevas mejoras.

---

## 🎯 Cambios Recientes Implementados

### ✅ Navegación Mejorada

- Botones del header ahora funcionan correctamente
- Scroll suave a secciones (#contacto, #caracteristicas, #precios)
- Menú móvil se cierra automáticamente
- Offset para navbar fijo (no tapa contenido)

### ✅ Preparación para Producción

- Código formateado con Prettier
- Build optimizado
- `netlify.toml` mejorado
- Security headers configurados

---

## 🚀 Deploy de las Nuevas Mejoras (5 minutos)

### Opción A: Deploy Automático (Recomendado)

**Si tu repositorio ya está conectado a Netlify:**

```bash
# 1. Commit todos los cambios
git add .
git commit -m "feat: mejoras de navegación y preparación para producción"

# 2. Push a GitHub
git push origin master

# 3. ¡Listo! Netlify detecta el push y deploya automáticamente
# Ver progreso en: https://app.netlify.com
```

⏱️ **Tiempo:** Netlify tarda ~3-5 minutos en buildear y deployar.

### Opción B: Deploy Manual desde Netlify UI

1. **Ir a Netlify Dashboard:**

   ```
   https://app.netlify.com → Sites → potentiamx
   ```

2. **Trigger deploy manual:**

   ```
   Deploys → Trigger deploy → Deploy site
   ```

3. **Ver progreso en tiempo real**

---

## ✅ Verificación Post-Deploy

### 1. Verificar que el sitio cargue

```
https://potentiamx.com
```

**Debe mostrar:**

- ✅ Landing page actualizada
- ✅ Sin errores en consola (F12)

### 2. Probar Navegación del Header

**Desktop:**

```
1. Click en "Características" → Debe hacer scroll suave
2. Click en "Precios" → Debe hacer scroll suave
3. Click en "Contacto" → Debe hacer scroll al formulario
4. Click en "Propiedades" → Debe navegar a /propiedades
```

**Mobile:**

```
1. Abrir menú hamburguesa
2. Click en cualquier opción
3. Verificar que el menú se cierre automáticamente
4. Verificar scroll suave a la sección
```

### 3. Verificar Funcionalidades Existentes

```bash
# Login
https://potentiamx.com/login

# Dashboard (después de login)
https://potentiamx.com/dashboard

# Marketplace
https://potentiamx.com/propiedades

# Tour 360° (usar un ID existente)
https://potentiamx.com/terreno/[id]
```

### 4. Verificar en Diferentes Dispositivos

- [ ] ✅ Desktop (1920px)
- [ ] ✅ Laptop (1024px)
- [ ] ✅ Tablet (768px)
- [ ] ✅ Mobile (375px)

---

## 🔍 Verificar Configuración Actual

### Variables de Entorno

**Ir a Netlify:**

```
Site settings → Environment variables
```

**Verificar que existan:**

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ RESEND_API_KEY
```

**Si falta alguna:** Agregarla y re-deployar.

### Build Settings

**Verificar en:**

```
Site settings → Build & deploy → Build settings
```

**Debe tener:**

```
Build command: npm run build:netlify
Publish directory: .next
```

**Si es diferente:** Actualizar y guardar.

---

## 🐛 Troubleshooting

### Build falla después del deploy

**Ver logs:**

```
Netlify → Deploys → [Latest failed] → Deploy log
```

**Común:**

1. Error de TypeScript → Ya lo arreglamos, pero verificar
2. Variables faltantes → Agregar en Site settings
3. Cambio de sintaxis → Ver log específico

**Solución rápida:**

```bash
# Probar build localmente primero
npm run build:netlify

# Si funciona local, el problema es de variables
# Verificar variables en Netlify
```

### Navegación no funciona

**Verificar:**

```
1. Abrir DevTools (F12)
2. Ir a Console
3. Buscar errores JavaScript
4. Verificar que app/globals.css tenga el scroll suave
```

**Si hay errores:**

```bash
# Limpiar caché del navegador
Ctrl + Shift + R (hard reload)

# O modo incógnito
Ctrl + Shift + N
```

### Cambios no se reflejan

**Forzar nuevo deploy:**

```
Netlify → Deploys → Trigger deploy → Clear cache and deploy site
```

---

## 📊 Monitoreo del Deploy

### Ver Deploy en Tiempo Real

**Mientras Netlify deploya:**

```
Netlify Dashboard → Deploys → [Building...]
```

**Ver logs:**

- Build log
- Function log
- Deploy summary

### Verificar Build Success

**Deploy exitoso muestra:**

```
✅ Site is live
🔗 https://potentiamx.com
⏱️ Published at [timestamp]
```

---

## 🎯 Checklist de Deployment

### Pre-Deploy

- [x] ✅ Cambios commiteados
- [x] ✅ Build local exitoso (`npm run build:netlify`)
- [x] ✅ Push a GitHub
- [ ] ⬜ Netlify detecta cambios

### Durante Deploy

- [ ] ⬜ Build inicia en Netlify
- [ ] ⬜ Build completo (~3-5 min)
- [ ] ⬜ Deploy exitoso

### Post-Deploy

- [ ] ⬜ Sitio carga en https://potentiamx.com
- [ ] ⬜ Navegación funciona correctamente
- [ ] ⬜ No hay errores en consola
- [ ] ⬜ Responsive en mobile
- [ ] ⬜ Funcionalidades existentes funcionan

---

## 🔄 Workflow Continuo

**Para futuras actualizaciones:**

```bash
# 1. Hacer cambios en local
npm run dev

# 2. Probar
npm run build:netlify

# 3. Commit
git add .
git commit -m "descripción del cambio"

# 4. Push (deploy automático)
git push origin master

# 5. Verificar en 3-5 minutos
https://potentiamx.com
```

---

## 📱 Probar las Nuevas Features

### Test 1: Navegación desde Landing

1. Ir a: https://potentiamx.com
2. Scroll hasta el header
3. Click en cada botón del menú
4. Verificar que funcionen

### Test 2: Mobile Menu

1. Abrir en móvil (o DevTools responsive)
2. Click en menú hamburguesa (☰)
3. Click en "Características"
4. Verificar:
   - ✅ Menú se cierra
   - ✅ Scroll suave a sección
   - ✅ Offset correcto (no tapa contenido)

### Test 3: Smooth Scroll

1. Click en "Precios" desde cualquier parte
2. Debe hacer scroll animado (no salto brusco)
3. Debe quedar visible la sección completa

---

## 🎉 ¡Deploy Completado!

**Tu sitio actualizado está en:**

```
🌐 https://potentiamx.com
```

**Nuevas features funcionando:**

- ✅ Navegación del header arreglada
- ✅ Scroll suave
- ✅ Menú móvil mejorado
- ✅ Código optimizado

---

## 📞 Si Necesitas Ayuda

**Ver logs de Netlify:**

```
https://app.netlify.com → Sites → potentiamx → Deploys
```

**Rollback si algo sale mal:**

```
Netlify → Deploys → [Deploy anterior] → Publish deploy
```

**Contacto:**

- Netlify Support: https://support.netlify.com
- Docs: https://docs.netlify.com

---

**Tiempo total: ~5 minutos** ⏱️
(desde push hasta sitio actualizado)
