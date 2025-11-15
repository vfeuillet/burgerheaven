#!/bin/bash

# Script de setup initial du template Restaurant E-Commerce
# Utilisation: ./setup.sh

echo "🍽️  Restaurant Template - Setup Initial"
echo "========================================"
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé. N'oubliez pas de le remplir avec vos valeurs !"
    echo ""
else
    echo "⚠️  Le fichier .env existe déjà, on ne le modifie pas."
    echo ""
fi

# Installer les dépendances
echo "📦 Installation des dépendances npm..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation terminée avec succès !"
    echo ""
    echo "📚 Prochaines étapes :"
    echo "   1. Remplissez le fichier .env avec vos clés Strapi et Stripe"
    echo "   2. Consultez CUSTOMIZE.md pour personnaliser le template"
    echo "   3. Lancez le serveur de développement : npm run dev"
    echo ""
    echo "🚀 Pour démarrer maintenant : npm run dev"
else
    echo ""
    echo "❌ Erreur lors de l'installation. Vérifiez votre connexion internet."
    exit 1
fi
