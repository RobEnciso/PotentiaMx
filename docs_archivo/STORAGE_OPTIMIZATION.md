# 📦 Guía de Optimización de Storage

## 📊 Estado Actual

**Plan**: Supabase Free Tier
**Límite**: 1 GB de almacenamiento
**Transferencia**: 2 GB/mes
**Uso actual de imágenes**: ~1.5-1.7 MB por imagen 360°
**Capacidad estimada**: ~600 imágenes antes de alcanzar el límite

## ✅ Mejores Prácticas Implementadas

### 1. Compresión Automática

- **Imágenes 360°**: Redimensionadas a 3840px (4K) en formato WebP
- **Calidad**: 85% (balance entre calidad visual y tamaño)
- **Tamaño objetivo**: 2 MB máximo por imagen
- **Reducción típica**: 95-97% del tamaño original

### 2. Imágenes de Portada Separadas

- **Dimensiones**: 1920px (Full HD)
- **Tamaño objetivo**: 1 MB máximo
- **Formato**: WebP con 85% de calidad
- **Beneficio**: Cargas más rápidas en el dashboard

### 3. Eliminación Completa

- Los terrenos eliminados también eliminan sus imágenes del Storage
- Se limpian hotspots asociados automáticamente
- Logs detallados para verificar el proceso

### 4. Herramienta de Limpieza

- **Ruta**: `/dashboard/storage-cleanup`
- Identifica archivos huérfanos (sin terreno asociado)
- Muestra estadísticas de uso de Storage
- Permite eliminación en lotes de forma segura

## 🚀 Recomendaciones por Etapa

### Etapa 1: Desarrollo/MVP (0-50 terrenos)

✅ **Mantener Supabase Free**

- Suficiente capacidad para pruebas iniciales
- Sin costo mientras validas el producto
- Usa la herramienta de limpieza mensualmente

**Acción**: Monitorear uso desde el dashboard de Supabase

### Etapa 2: Crecimiento (50-100 terrenos)

⚠️ **Considerar migración a alternativa económica**

**Opción A: Cloudflare R2** (Recomendada)

- **Costo**: ~$0.15-0.30/mes para 10-20 GB
- **Ventaja**: Sin costo de egreso (transferencia gratis)
- **Setup**: Compatible con S3 API, migración sencilla

**Opción B: Supabase Pro**

- **Costo**: $25/mes
- **Incluye**: 100 GB Storage + todas las features Pro
- **Mejor si**: Necesitas otras features Pro (Compute, Database size, etc.)

### Etapa 3: Escala (100+ terrenos)

🚀 **Infraestructura optimizada**

**Arquitectura recomendada**:

1. **Cloudflare R2** para imágenes (costo mínimo)
2. **Supabase Free/Pro** solo para DB y Auth
3. **CDN**: Cloudflare R2 incluye CDN global gratis
4. **Costo estimado**: $0.50-2/mes para 50-100 GB

## 💰 Comparativa de Costos (100 GB)

| Proveedor         | Storage  | Transferencia  | Total/mes    |
| ----------------- | -------- | -------------- | ------------ |
| **Cloudflare R2** | $1.50    | $0             | **$1.50** ⭐ |
| **Supabase Pro**  | Incluido | Incluido 200GB | **$25.00**   |
| **AWS S3**        | $2.30    | ~$9.00 (100GB) | **$11.30**   |
| **Cloudinary**    | $99+     | Incluido       | **$99+**     |

## 🛠️ Migración a Cloudflare R2 (Guía Rápida)

### 1. Crear cuenta en Cloudflare

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Autenticarse
wrangler login
```

### 2. Crear bucket R2

```bash
# Crear bucket
wrangler r2 bucket create landview-images

# Configurar CORS
wrangler r2 bucket cors put landview-images --cors-config cors.json
```

### 3. Actualizar código

```javascript
// Cambiar de Supabase Storage a R2
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
```

### 4. Migrar imágenes existentes

```javascript
// Script de migración (ejecutar una vez)
async function migrateToR2() {
  const terrenos = await supabase.from('terrenos').select('*');

  for (const terreno of terrenos) {
    // Descargar de Supabase
    // Subir a R2
    // Actualizar URLs en DB
  }
}
```

## 📈 Monitoreo de Uso

### Dashboard de Supabase

1. Ir a: **Settings** → **Billing** → **Storage**
2. Revisar: Uso actual en MB/GB
3. Alertas: Configurar notificación al 80% de uso

### Herramienta Interna

- **Ruta**: `/dashboard/storage-cleanup`
- **Frecuencia sugerida**: Revisar mensualmente
- **Acción**: Eliminar archivos huérfanos si > 10% del storage

### Comandos útiles de Supabase CLI

```bash
# Ver uso de storage
supabase storage list tours-panoramicos

# Ver estadísticas
supabase inspect db usage
```

## 🎯 Objetivos de Optimización

### Corto plazo (3 meses)

- [ ] Mantener uso de Storage < 80% del límite Free
- [ ] Ejecutar limpieza mensual de archivos huérfanos
- [ ] Documentar patrones de uso (imágenes por terreno promedio)

### Mediano plazo (6 meses)

- [ ] Evaluar migración a R2 si se supera 50 terrenos
- [ ] Implementar lazy loading de imágenes en viewer
- [ ] Considerar thumbnails adicionales para previews

### Largo plazo (12+ meses)

- [ ] Sistema de CDN multi-región
- [ ] Compresión adaptativa según dispositivo
- [ ] Análisis de imágenes menos vistas para archivar

## 📝 Notas Importantes

### ¿Por qué no usar Vercel Blob?

- Plan gratuito muy limitado (500 MB)
- Caro al escalar ($0.15/GB vs $0.015/GB de R2)
- Mejor para assets estáticos pequeños

### ¿Por qué no usar Cloudinary?

- Excelente para transformaciones on-the-fly
- Muy caro al escalar ($99/mes para 50 GB)
- Mejor para e-commerce con muchas variantes de imagen

### ¿Por qué R2 es la mejor opción?

- ✅ Sin costo de egreso (transferencia gratis ilimitada)
- ✅ Compatible con S3 (fácil migración, código portable)
- ✅ CDN de Cloudflare incluido (velocidad global)
- ✅ Precio más bajo del mercado ($0.015/GB/mes)
- ✅ Sin compromiso mínimo de uso

## 🔧 Mantenimiento Mensual

**Checklist (5 minutos/mes)**:

1. Visitar `/dashboard/storage-cleanup`
2. Hacer clic en "Analizar Storage"
3. Revisar estadísticas de uso
4. Si hay archivos huérfanos > 10%, eliminarlos
5. Verificar en Supabase Dashboard que el uso esté OK

## 📞 Recursos y Soporte

- **Supabase Docs**: https://supabase.com/docs/guides/storage
- **Cloudflare R2 Docs**: https://developers.cloudflare.com/r2/
- **S3 API Compatibility**: https://docs.aws.amazon.com/AmazonS3/latest/API/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

---

**Última actualización**: 2025-10-16
**Revisión sugerida**: Cada 3 meses o al alcanzar 70% de uso
