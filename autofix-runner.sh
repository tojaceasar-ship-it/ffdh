#!/bin/bash

# AUTOFIX RUNNER - Automatyczny system naprawczy PRO GOLD
# Użycie: ./autofix-runner.sh [faza]
# Faz: 1, 2, 3, 4 lub 'all'

set -e

PHASE=${1:-"all"}
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🤖 AUTOFIX PILOT - System Naprawczy PRO GOLD${NC}"
echo "=========================================="

# Funkcja weryfikacji
verify() {
    echo -e "\n${YELLOW}🔍 Weryfikacja...${NC}"
    npm run type-check && echo -e "${GREEN}✅ TypeScript OK${NC}" || { echo -e "${RED}❌ TypeScript FAILED${NC}"; exit 1; }
    npm run lint && echo -e "${GREEN}✅ Linter OK${NC}" || { echo -e "${RED}❌ Linter FAILED${NC}"; exit 1; }
}

# FAZA 1: CRITICAL FIXES
if [ "$PHASE" = "1" ] || [ "$PHASE" = "all" ]; then
    echo -e "\n${YELLOW}🔴 FAZA 1: CRITICAL FIXES${NC}"
    
    # AUTO-FIX-001: Usunąć react-router-dom
    echo "📦 Usuwanie react-router-dom..."
    npm uninstall react-router-dom
    echo -e "${GREEN}✅ AUTO-FIX-001: Usunięto react-router-dom${NC}"
    
    # AUTO-FIX-002: Usunąć martwy kod
    echo "🗑️  Usuwanie martwego kodu..."
    [ -f "src/App.jsx" ] && rm src/App.jsx && echo "   Usunięto src/App.jsx"
    [ -f "src/routes.test.jsx" ] && rm src/routes.test.jsx && echo "   Usunięto src/routes.test.jsx"
    echo -e "${GREEN}✅ AUTO-FIX-002: Usunięto martwy kod${NC}"
    
    verify
fi

# FAZA 2: HIGH PRIORITY
if [ "$PHASE" = "2" ] || [ "$PHASE" = "all" ]; then
    echo -e "\n${YELLOW}⚠️  FAZA 2: HIGH PRIORITY FIXES${NC}"
    echo "⚠️  Wymaga ręcznej interwencji - patrz AUTOFIX_PILOT.md"
fi

# FAZA 3: MEDIUM PRIORITY
if [ "$PHASE" = "3" ] || [ "$PHASE" = "all" ]; then
    echo -e "\n${YELLOW}⚠️  FAZA 3: MEDIUM PRIORITY FIXES${NC}"
    echo "⚠️  Wymaga ręcznej interwencji - patrz AUTOFIX_PILOT.md"
fi

# FAZA 4: OPTIMIZATION
if [ "$PHASE" = "4" ] || [ "$PHASE" = "all" ]; then
    echo -e "\n${YELLOW}📝 FAZA 4: OPTIMIZATION${NC}"
    echo "⚠️  Wymaga ręcznej interwencji - patrz AUTOFIX_PILOT.md"
fi

echo -e "\n${GREEN}✅ AUTOFIX RUNNER ZAKOŃCZONY${NC}"
echo "📋 Zaktualizuj AUTOFIX_PROGRESS.md z wykonanymi zadaniami"

