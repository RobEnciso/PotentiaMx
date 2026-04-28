# Prompt para Gemini - Rotación de API Keys

Copia y pega este prompt en Gemini (gemini.google.com):

---

Necesito rotar las API keys de mi proyecto Next.js + Supabase por seguridad. Necesito que me guíes paso a paso con CAPTURAS DE PANTALLA de cada proceso.

## Servicios que uso:

1. **Supabase** (Base de datos y autenticación)
   - Proyecto actual: `tuhojmupstisctgaepsc`
   - URL: https://supabase.com/dashboard/project/tuhojmupstisctgaepsc

2. **Resend** (Servicio de emails)
   - Key actual a eliminar: `re_D7W29AeR_EVpTYRmTknLK7YF637EyWpWn`
   - URL: https://resend.com/api-keys

3. **PostHog** (Analytics)
   - Key actual a eliminar: `phx_xLk72QzU668xDuk4znsQgmOpWwLlFlqdNZS2rYet9qmHZ1i`
   - Project ID: `253501`
   - URL: https://us.posthog.com/settings/user-api-keys

## Lo que necesito:

Por favor, para CADA servicio, muéstrame:

### A. Capturas de pantalla mostrando:
1. Dónde hacer login
2. Dónde encontrar la sección de API Keys
3. Cómo eliminar/revocar la key antigua (con flechas o resaltado)
4. Cómo generar una nueva key
5. Dónde copiar la nueva key generada

### B. Paso a paso escrito para cada servicio:
- Enumera cada clic que debo hacer
- Qué botones buscar
- Qué campos llenar
- Qué permisos/scopes seleccionar

### C. Al final, necesito saber:
- ¿Qué valores exactos debo poner en mi archivo `.env.local`?
- ¿En qué orden debo hacer las rotaciones?
- ¿Cómo verifico que las nuevas keys funcionan?

## Orden sugerido:
1. Primero Supabase
2. Luego Resend
3. Finalmente PostHog

**IMPORTANTE:** Necesito capturas de pantalla reales de las interfaces actuales (2024-2025) de estos servicios, mostrando exactamente dónde hacer clic.

¿Puedes empezar con Supabase y mostrarme capturas de pantalla paso a paso?

---

# Instrucciones adicionales si Gemini necesita más contexto:

Si Gemini te pide más información, dile:

"Estoy en Windows, usando Next.js 15 con App Router. Mi archivo .env.local tiene estas variables que necesito actualizar:

```
NEXT_PUBLIC_SUPABASE_URL=https://tuhojmupstisctgaepsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
RESEND_API_KEY=re_D7W29AeR...
POSTHOG_PERSONAL_API_KEY=phx_xLk72QzU...
NEXT_PUBLIC_POSTHOG_KEY=phc_zh5ppYkG...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_PROJECT_ID=253501
```

Necesito rotar las keys SECRETAS (las que no tienen NEXT_PUBLIC_) porque fueron expuestas accidentalmente."

---

# Después de completar la rotación:

Cuando tengas todas las nuevas keys, vuelve aquí y yo te ayudo a:
1. Actualizar el archivo .env.local
2. Reiniciar el servidor
3. Verificar que todo funcione correctamente

---

**NOTA IMPORTANTE:**
- Guarda las nuevas keys en un lugar seguro (bloc de notas temporal)
- No cierres las pestañas hasta que hayas confirmado que todo funciona
- Las keys se muestran solo UNA VEZ al generarlas

---

**Creado:** 2025-12-07
**Para proyecto:** LandView App CMS (PotentiaMX)
