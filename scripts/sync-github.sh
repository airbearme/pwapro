#!/bin/bash

# GitHub Sync Script for AirBear PWA
# Syncs all changes to GitHub repository

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🐻 AirBear GitHub Sync${NC}"
echo "===================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    git branch -M main
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${BLUE}📝 Files changed:${NC}"
    git status -s
    echo ""
    
    # Stage all changes
    echo -e "${BLUE}Staging changes...${NC}"
    git add .
    
    # Get commit message
    echo -e "${YELLOW}Enter commit message (or press Enter for auto-message):${NC}"
    read COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Production update: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Commit
    echo -e "${BLUE}Committing changes...${NC}"
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✓ Changes committed${NC}"
else
    echo -e "${YELLOW}No changes to commit${NC}"
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo ""
    echo -e "${YELLOW}No remote repository configured.${NC}"
    echo -e "Choose repository:"
    echo "1. github.com/airbearme/pwa4 (existing)"
    echo "2. github.com/airbearme/pwa5 (new)"
    echo -e "${YELLOW}Enter choice (1 or 2):${NC}"
    read REPO_CHOICE
    
    if [ "$REPO_CHOICE" = "1" ]; then
        git remote add origin https://github.com/airbearme/pwa4.git
    elif [ "$REPO_CHOICE" = "2" ]; then
        git remote add origin https://github.com/airbearme/pwa5.git
    else
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Remote added${NC}"
fi

# Push to GitHub
echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"

if git push -u origin main 2>&1 | grep -q "rejected"; then
    echo -e "${YELLOW}Push rejected. Attempting force push...${NC}"
    echo -e "${RED}⚠️  WARNING: This will overwrite remote changes!${NC}"
    echo -e "${YELLOW}Continue? (y/N):${NC}"
    read CONFIRM
    
    if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
        git push -u origin main --force
    else
        echo -e "${RED}Push cancelled${NC}"
        exit 1
    fi
else
    git push -u origin main
fi

echo ""
echo -e "${GREEN}✓ Successfully synced to GitHub!${NC}"
echo ""
echo -e "${BLUE}GitHub Actions will now automatically deploy to production.${NC}"
echo -e "${BLUE}Monitor deployment at: https://github.com/airbearme/pwa4/actions${NC}"
echo ""
