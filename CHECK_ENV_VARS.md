# Variables de Entorno Necesarias para Demo Tours

## Variables Requeridas en Producción (Netlify)

Para que el sistema de demo tours funcione correctamente, necesitas configurar estas variables de entorno en Netlify:

### 1. Variables Públicas (ya configuradas)
```
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 2. Variables del Servidor (CRÍTICO - verifica que estén configuradas)
```
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Esta variable es **CRÍTICA** porque:
- Se usa en `lib/createDemoTour.js` para crear tours con permisos de administrador
- Sin ella, el API `/api/create-demo-tour` fallará
- No debe estar en el código ni en `.env.local` público por seguridad

## Dónde Configurar en Netlify

1. Ve a tu sitio en Netlify Dashboard
2. Site settings → Environment variables
3. Agrega la variable:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (copia de Supabase Dashboard → Settings → API → service_role key)
   - Scopes: All scopes

4. **IMPORTANTE**: Después de agregar la variable, haz un nuevo deploy:
   ```bash
   git commit --allow-empty -m "trigger deploy after env vars update"
   git push
   ```

## Cómo Obtener el Service Role Key

1. Ve a Supabase Dashboard
2. Project Settings → API
3. Copia el valor de `service_role` (secret)
4. **NUNCA** lo compartas públicamente ni lo subas a Git

## Verificar si está configurada

En los logs de Netlify al hacer deploy, deberías ver:
```
Environment variables set:
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ SUPABASE_SERVICE_ROLE_KEY
```

Si no ves `SUPABASE_SERVICE_ROLE_KEY`, el API de demo tours fallará silenciosamente.
