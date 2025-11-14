# 🗑️ ARCHIVOS CANDIDATOS PARA ELIMINACIÓN

**Fecha**: 17 de Enero, 2025
**Total de archivos a eliminar**: 11

---

## 📋 RESUMEN

- **Scripts SQL temporales**: 5 archivos (27.8 KB aprox)
- **Documentación obsoleta**: 5 archivos (variable)
- **Archivos vacíos**: 1 archivo (0 KB)

**Espacio estimado a liberar**: ~50-100 KB

---

## 🔴 SCRIPTS SQL TEMPORALES - ELIMINAR

Estos scripts fueron creados para solucionar problemas pero ya fueron ejecutados exitosamente. No son necesarios para el funcionamiento del proyecto.

### 1. ADMIN_RLS_POLICIES.sql

- **Motivo**: Primera versión con errores de dependencias
- **Reemplazado por**: `FIX_ADMIN_RLS_V2.sql`
- **Estado**: ❌ Obsoleto
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\ADMIN_RLS_POLICIES.sql
```

---

### 2. FIX_ADMIN_RLS.sql

- **Motivo**: Primera versión con errores de dependencias
- **Reemplazado por**: `FIX_ADMIN_RLS_V2.sql`
- **Estado**: ❌ Obsoleto
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\FIX_ADMIN_RLS.sql
```

---

### 3. CREATE_FOREIGN_KEY.sql

- **Motivo**: Script que falló debido a datos huérfanos
- **Reemplazado por**: `FIX_USER_PROFILES_FINAL.sql`
- **Estado**: ❌ Obsoleto
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\CREATE_FOREIGN_KEY.sql
```

---

### 4. FIX_USER_PROFILES_AND_FK.sql

- **Motivo**: Script con error - intentaba insertar columna `email` que no existe
- **Reemplazado por**: `FIX_USER_PROFILES_FINAL.sql`
- **Estado**: ❌ Obsoleto
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\FIX_USER_PROFILES_AND_FK.sql
```

---

### 5. CHECK_AND_FIX_USER_PROFILES.sql

- **Motivo**: Script de diagnóstico, ya no necesario
- **Estado**: ❌ Obsoleto (solo era para debug)
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\CHECK_AND_FIX_USER_PROFILES.sql
```

---

## 🟡 DOCUMENTACIÓN DUPLICADA/DESACTUALIZADA

### 6. mejoras.txt

- **Motivo**: Contenido duplicado con `mejoras_pendientes.md`
- **Reemplazado por**: `mejoras_pendientes.md` (formato Markdown)
- **Estado**: ❌ Duplicado
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\mejoras.txt
```

---

### 7. RESUMEN_SESION.md

- **Motivo**: Información ahora consolidada en `MINUTA.md`
- **Estado**: ❌ Obsoleto
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\RESUMEN_SESION.md
```

---

### 8. LANDING_PAGE_README.md

- **Motivo**: Duplicado con `GUIA_LANDING_PAGE.md`
- **Estado**: ❌ Duplicado
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\LANDING_PAGE_README.md
```

---

### 9. CONEXION_COMPLETA.md

- **Motivo**: Información desactualizada sobre conexiones
- **Estado**: ❌ Obsoleto
- **Acción**: Eliminar (verificar primero si no tiene info única)

```bash
rm C:\Users\Roberto\landview-app-cms\CONEXION_COMPLETA.md
```

---

### 10. PROJECT_STATUS.md

- **Motivo**: Ahora consolidado en `MINUTA.md` (sección "Estado Actual")
- **Estado**: ❌ Obsoleto
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\PROJECT_STATUS.md
```

---

## 🔵 ARCHIVOS VACÍOS

### 11. NUL

- **Motivo**: Archivo vacío sin propósito (probablemente error de redirección)
- **Estado**: ❌ Basura
- **Acción**: Eliminar

```bash
rm C:\Users\Roberto\landview-app-cms\NUL
```

---

## ✅ SCRIPTS SQL A MANTENER

Estos scripts fueron exitosos y deben conservarse como referencia:

1. ✅ **FIX_USER_PROFILES_FINAL.sql** - Creación de user_profiles + FK
2. ✅ **FIX_ADMIN_RLS_V2.sql** - Políticas RLS para administradores
3. ✅ **CREATE_ADMIN_GET_USER_EMAIL_FUNCTION.sql** - Función RPC para emails
4. ✅ **SETUP_DUAL_MODEL.sql** - Setup inicial completo
5. ✅ **SUPABASE_RLS_SETUP.sql** - Referencia de RLS
6. ✅ **DIAGNOSTICO_SUPABASE.sql** - Scripts de diagnóstico
7. ✅ **VERIFICACION_RAPIDA.sql** - Verificación de setup

---

## ✅ DOCUMENTACIÓN A MANTENER

1. ✅ **MINUTA.md** - ⭐ Historial completo del proyecto (NUEVO)
2. ✅ **CLAUDE.md** - ⭐ Instrucciones para Claude Code (CRÍTICO)
3. ✅ **README.md** - Documentación general
4. ✅ **TESTING.md** - Guía de testing
5. ✅ **GOOGLE_OAUTH_SETUP.md** - Setup de OAuth
6. ✅ **MULTI_TENANCY_SETUP.md** - Configuración multi-tenant
7. ✅ **GUIA_IMPLEMENTACION_COMPLETA.md** - Guía de implementación
8. ✅ **STORAGE_OPTIMIZATION.md** - Optimización de storage
9. ✅ **MEJORAS_VISOR_PUBLICO.md** - Mejoras del visor
10. ✅ **SOLUCION_MARKETPLACE.md** - Solución de marketplace
11. ✅ **mejoras_pendientes.md** - Lista de mejoras futuras

---

## 🚀 SCRIPT DE LIMPIEZA AUTOMÁTICA

Puedes copiar y ejecutar este script para eliminar todos los archivos de una vez:

### PowerShell (Windows):

```powershell
# Navegar al directorio del proyecto
cd C:\Users\Roberto\landview-app-cms

# Eliminar scripts SQL obsoletos
Remove-Item -Path ".\ADMIN_RLS_POLICIES.sql" -Force
Remove-Item -Path ".\FIX_ADMIN_RLS.sql" -Force
Remove-Item -Path ".\CREATE_FOREIGN_KEY.sql" -Force
Remove-Item -Path ".\FIX_USER_PROFILES_AND_FK.sql" -Force
Remove-Item -Path ".\CHECK_AND_FIX_USER_PROFILES.sql" -Force

# Eliminar documentación obsoleta
Remove-Item -Path ".\mejoras.txt" -Force
Remove-Item -Path ".\RESUMEN_SESION.md" -Force
Remove-Item -Path ".\LANDING_PAGE_README.md" -Force
Remove-Item -Path ".\CONEXION_COMPLETA.md" -Force
Remove-Item -Path ".\PROJECT_STATUS.md" -Force

# Eliminar archivos vacíos
Remove-Item -Path ".\NUL" -Force

Write-Host "✅ Limpieza completada: 11 archivos eliminados" -ForegroundColor Green
```

### Bash (Linux/Mac):

```bash
#!/bin/bash
cd /c/Users/Roberto/landview-app-cms

# Eliminar scripts SQL obsoletos
rm -f ADMIN_RLS_POLICIES.sql
rm -f FIX_ADMIN_RLS.sql
rm -f CREATE_FOREIGN_KEY.sql
rm -f FIX_USER_PROFILES_AND_FK.sql
rm -f CHECK_AND_FIX_USER_PROFILES.sql

# Eliminar documentación obsoleta
rm -f mejoras.txt
rm -f RESUMEN_SESION.md
rm -f LANDING_PAGE_README.md
rm -f CONEXION_COMPLETA.md
rm -f PROJECT_STATUS.md

# Eliminar archivos vacíos
rm -f NUL

echo "✅ Limpieza completada: 11 archivos eliminados"
```

---

## ⚠️ IMPORTANTE ANTES DE ELIMINAR

1. **Hacer backup**: Si tienes dudas, haz una copia de seguridad primero

   ```bash
   mkdir backup_archivos_obsoletos
   # Copiar archivos antes de eliminar
   ```

2. **Verificar Git**: Si usas control de versiones, asegúrate de que no hay cambios sin commitear

   ```bash
   git status
   ```

3. **Revisar contenido**: Algunos archivos pueden tener información única. Revisa antes de eliminar definitivamente.

---

## 📊 COMPARATIVA

### Antes de la limpieza:

- Scripts SQL: 12 archivos
- Documentación MD: 15 archivos
- Archivos basura: 1 archivo

### Después de la limpieza:

- Scripts SQL: 7 archivos ✅ (los realmente útiles)
- Documentación MD: 11 archivos ✅ (consolidados)
- Archivos basura: 0 archivos ✅

**Reducción**: -11 archivos (-27%)

---

## 🎯 RECOMENDACIONES

1. **No eliminar** archivos de configuración (.json, .ts, .mjs)
2. **No eliminar** archivos del código fuente (app/, components/, lib/)
3. **No eliminar** CLAUDE.md - es crítico para desarrollo con IA
4. **Mantener** MINUTA.md actualizado cuando hagas cambios importantes
5. **Crear** carpeta `docs/archive/` para guardar documentación antigua si tienes dudas

---

**Fecha de generación**: 17 de Enero, 2025
**Próxima revisión**: Cada 2 meses o después de cambios mayores
