#!/bin/bash
# Script de deployment rápido para PotentiaMX
# Uso: ./deploy.sh "mensaje del commit"

echo "🚀 Iniciando deployment de PotentiaMX..."
echo ""

# Mensaje del commit (usar argumento o default)
COMMIT_MSG="${1:-feat: actualización de producción}"

echo "📝 Commit message: $COMMIT_MSG"
echo ""

# 1. Verificar que no haya cambios sin commitear
echo "🔍 Verificando estado de Git..."
if [[ -n $(git status -s) ]]; then
    echo "✅ Cambios detectados, preparando commit..."

    # 2. Add todos los cambios
    echo "📦 Agregando archivos..."
    git add .

    # 3. Commit
    echo "💾 Creando commit..."
    git commit -m "$COMMIT_MSG"

    echo "✅ Commit creado exitosamente"
else
    echo "ℹ️  No hay cambios nuevos para commitear"
fi

echo ""

# 4. Push a GitHub
echo "🌐 Pusheando a GitHub..."
git push origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push exitoso!"
    echo ""
    echo "🎯 Netlify está deployando automáticamente..."
    echo ""
    echo "📊 Ver progreso en:"
    echo "   https://app.netlify.com"
    echo ""
    echo "🌐 Tu sitio estará actualizado en ~3-5 minutos:"
    echo "   https://potentiamx.com"
    echo ""
    echo "✨ ¡Deployment iniciado con éxito!"
else
    echo ""
    echo "❌ Error al pushear a GitHub"
    echo "   Verifica tu conexión y permisos"
    exit 1
fi
