#!/bin/bash

# Production Testing Script for AirBear PWA
# Tests all critical functionality before deployment

set -e

echo "🐻 AirBear Production Testing Suite"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOMAIN="${1:-https://airbear.me}"

echo "Testing domain: $DOMAIN"
echo ""

# Test 1: Health Check
echo -n "1. Testing health endpoint... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/health")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_STATUS)${NC}"
    exit 1
fi

# Test 2: Homepage
echo -n "2. Testing homepage... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_STATUS)${NC}"
    exit 1
fi

# Test 3: Map Page
echo -n "3. Testing map page... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/map")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_STATUS)${NC}"
    exit 1
fi

# Test 4: Login Page
echo -n "4. Testing login page... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/auth/login")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_STATUS)${NC}"
    exit 1
fi

# Test 5: Products Page
echo -n "5. Testing products page... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/products")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_STATUS)${NC}"
    exit 1
fi

# Test 6: Stripe Webhook
echo -n "6. Testing Stripe webhook... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$DOMAIN/api/stripe/webhook")
if [ "$HTTP_STATUS" -eq 400 ] || [ "$HTTP_STATUS" -eq 401 ]; then
    echo -e "${GREEN}✓ PASS (properly secured)${NC}"
else
    echo -e "${YELLOW}⚠ WARNING (HTTP $HTTP_STATUS)${NC}"
fi

# Test 7: Auth Callback
echo -n "7. Testing auth callback... "
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/auth/callback")
if [ "$HTTP_STATUS" -eq 302 ] || [ "$HTTP_STATUS" -eq 400 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ WARNING (HTTP $HTTP_STATUS)${NC}"
fi

# Test 8: SSL/HTTPS
echo -n "8. Testing SSL certificate... "
if curl -sSf "$DOMAIN" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}===================================="
echo "All critical tests passed! 🎉"
echo -e "====================================${NC}"
echo ""
echo "Next steps:"
echo "1. Test OAuth login with Google/Apple"
echo "2. Test Stripe payment flow"
echo "3. Verify real-time map updates"
echo "4. Check mobile responsiveness"
echo ""
