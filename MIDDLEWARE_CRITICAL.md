# ⚠️ MIDDLEWARE CRÍTICO - NO REVERTIR

## 🔴 PROBLEMA RECURRENTE

Este middleware ha causado **lentitud de 26+ segundos** múltiples veces cuando se revierte a la configuración por defecto.

## ✅ CONFIGURACIÓN CORRECTA (NO CAMBIAR)

```typescript
export const config = {
  matcher: [
    // ✅ EXCLUIR /terreno/* (rutas públicas)
    // ✅ EXCLUIR assets estáticos (.png, .jpg, .webp, etc)
    // ✅ EXCLUIR archivos de Supabase Storage
    '/((?!_next/static|_next/image|favicon.ico|terreno|api|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$|supabase).*)',

    // ✅ INCLUIR solo rutas protegidas
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
```

## ❌ CONFIGURACIÓN INCORRECTA (CAUSA LENTITUD)

```typescript
export const config = {
  matcher: [
    // ❌ NUNCA usar esta configuración genérica
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 🐛 POR QUÉ CAUSA LENTITUD:

1. **Middleware ejecuta en TODAS las rutas** incluyendo:
   - Cada imagen panorámica 4K (puede haber 5-10 por tour)
   - Cada archivo estático (.css, .js, .png, .svg)
   - Archivos de Supabase Storage

2. **Cada request ejecuta `getSession()`**:
   - Si un tour tiene 5 panoramas 4K = 5 llamadas a Supabase
   - Más assets estáticos = +10-20 llamadas más
   - **Total: 20-30 llamadas innecesarias** a Supabase

3. **Resultado**:
   - Tiempo de carga: **26+ segundos** ❌
   - Con la configuración correcta: **<3 segundos** ✅

## 🔒 REGLAS:

1. **NUNCA** revertir el matcher a la configuración genérica
2. **SIEMPRE** excluir `/terreno/*` del middleware (son rutas públicas)
3. **SIEMPRE** excluir assets estáticos
4. **SOLO** ejecutar middleware en rutas que requieren autenticación

## 📋 CHECKLIST ANTES DE HACER COMMIT:

- [ ] Verificar que `middleware.ts` tiene la configuración correcta
- [ ] Comprobar que `/terreno` está excluido del matcher
- [ ] Confirmar que assets estáticos están excluidos
- [ ] Probar en incógnito que carga en <3 segundos

## 🚨 SI ALGUIEN REVIERTE ESTO:

Ejecutar inmediatamente:

```bash
git revert HEAD
git push
```

Y restaurar la configuración correcta del archivo `middleware.ts`.

## 📝 HISTORIAL:

- **2025-01-XX**: Problema detectado y corregido (commit: 45adf5c)
- Este problema ha ocurrido **múltiples veces** por reversión accidental

## 🎯 REFERENCIA:

Commit correcto: `45adf5c - perf: fix critical 26s loading time`

Si tienes dudas, revisa este commit para ver la configuración correcta.
