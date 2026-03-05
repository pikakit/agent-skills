#!/bin/bash

# Vercel Deployment Script — Zero-Auth Deploy
# Version: 2.0.0
# Contract: vercel-deploy v2.0.0
# See: references/engineering-spec.md
# Skill: vercel-deploy
#
# Package → Detect Framework → Upload → Preview URL + Claim URL
#
# Usage: bash deploy.sh [path] [options]
# Returns: JSON with previewUrl, claimUrl, deploymentId, projectId

VERSION="2.0.0"
DEPLOY_ENDPOINT="https://claude-skills-deploy.vercel.com/api/deploy"
UPLOAD_TIMEOUT=300  # seconds
MAX_RETRIES=1       # 1 retry on timeout (per SKILL.md)

set -e

# --- Help ---
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    cat <<EOF

Vercel Deploy v${VERSION}

Usage:
  bash deploy.sh [path]            Deploy directory to Vercel
  bash deploy.sh file.tgz          Deploy existing tarball
  bash deploy.sh --help            Show this help

Arguments:
  path    Directory or .tgz file (default: current directory)

What it does:
  1. Check prerequisites (bash, tar, curl)
  2. Package project (exclude node_modules, .git, .env*, dist, .next)
  3. Detect framework from package.json (40+ frameworks)
  4. Upload to Vercel → get preview URL + claim URL

Output (JSON to stdout):
  {
    "previewUrl": "https://skill-deploy-abc123.vercel.app",
    "claimUrl": "https://vercel.com/claim-deployment?code=...",
    "deploymentId": "dpl_...",
    "projectId": "prj_..."
  }

Exit Codes:
  0  SUCCESS  — Deployed, URL returned
  1  ERROR    — Deployment failed

EOF
    exit 0
fi

if [[ "$1" == "--version" || "$1" == "-v" ]]; then
    echo "Vercel Deploy v${VERSION}"
    exit 0
fi

# --- Prerequisite Check ---
check_prereqs() {
    local missing=()
    for cmd in tar curl; do
        if ! command -v "$cmd" &>/dev/null; then
            missing+=("$cmd")
        fi
    done

    if [ ${#missing[@]} -gt 0 ]; then
        emit_error "ERR_MISSING_PREREQ" "Missing required commands: ${missing[*]}. Install them and retry." >&2
        exit 1
    fi
}

# --- Structured JSON Error Output ---
emit_error() {
    local code="$1"
    local message="$2"
    echo "{\"success\":false,\"error\":{\"code\":\"$code\",\"message\":\"$message\",\"recoverable\":true}}" >&2
}

check_prereqs

# --- Framework Detection ---
detect_framework() {
    local pkg_json="$1"

    if [ ! -f "$pkg_json" ]; then
        echo "null"
        return
    fi

    local content=$(cat "$pkg_json")

    has_dep() {
        echo "$content" | grep -q "\"$1\""
    }

    # Order matters — check more specific frameworks first

    # Meta-frameworks
    if has_dep "blitz"; then echo "blitzjs"; return; fi
    if has_dep "next"; then echo "nextjs"; return; fi
    if has_dep "gatsby"; then echo "gatsby"; return; fi
    if has_dep "@remix-run/"; then echo "remix"; return; fi
    if has_dep "@react-router/"; then echo "react-router"; return; fi
    if has_dep "@tanstack/start"; then echo "tanstack-start"; return; fi
    if has_dep "astro"; then echo "astro"; return; fi

    # Shopify
    if has_dep "@shopify/hydrogen"; then echo "hydrogen"; return; fi

    # Svelte
    if has_dep "@sveltejs/kit"; then echo "sveltekit-1"; return; fi
    if has_dep "svelte"; then echo "svelte"; return; fi

    # Vue
    if has_dep "nuxt"; then echo "nuxtjs"; return; fi
    if has_dep "vitepress"; then echo "vitepress"; return; fi
    if has_dep "vuepress"; then echo "vuepress"; return; fi
    if has_dep "gridsome"; then echo "gridsome"; return; fi

    # Solid / Docusaurus / Redwood
    if has_dep "@solidjs/start"; then echo "solidstart-1"; return; fi
    if has_dep "@docusaurus/core"; then echo "docusaurus-2"; return; fi
    if has_dep "@redwoodjs/"; then echo "redwoodjs"; return; fi

    # Static site generators
    if has_dep "hexo"; then echo "hexo"; return; fi
    if has_dep "@11ty/eleventy"; then echo "eleventy"; return; fi

    # Angular / Ionic
    if has_dep "@ionic/angular"; then echo "ionic-angular"; return; fi
    if has_dep "@angular/core"; then echo "angular"; return; fi
    if has_dep "@ionic/react"; then echo "ionic-react"; return; fi

    # React
    if has_dep "react-scripts"; then echo "create-react-app"; return; fi

    # Other frameworks
    if has_dep "ember-cli" || has_dep "ember-source"; then echo "ember"; return; fi
    if has_dep "@dojo/framework"; then echo "dojo"; return; fi
    if has_dep "@polymer/"; then echo "polymer"; return; fi
    if has_dep "preact"; then echo "preact"; return; fi
    if has_dep "@stencil/core"; then echo "stencil"; return; fi
    if has_dep "umi"; then echo "umijs"; return; fi
    if has_dep "sapper"; then echo "sapper"; return; fi
    if has_dep "saber"; then echo "saber"; return; fi

    # Sanity / Storybook
    if has_dep "sanity"; then echo "sanity-v3"; return; fi
    if has_dep "@sanity/"; then echo "sanity"; return; fi
    if has_dep "@storybook/"; then echo "storybook"; return; fi

    # Backend frameworks
    if has_dep "@nestjs/core"; then echo "nestjs"; return; fi
    if has_dep "elysia"; then echo "elysia"; return; fi
    if has_dep "hono"; then echo "hono"; return; fi
    if has_dep "fastify"; then echo "fastify"; return; fi
    if has_dep "h3"; then echo "h3"; return; fi
    if has_dep "nitropack"; then echo "nitro"; return; fi
    if has_dep "express"; then echo "express"; return; fi

    # Build tools (check last)
    if has_dep "vite"; then echo "vite"; return; fi
    if has_dep "parcel"; then echo "parcel"; return; fi

    echo "null"
}

# --- Upload with Retry ---
upload_with_retry() {
    local tarball="$1"
    local framework="$2"
    local attempt=0
    local response=""
    local curl_exit=0

    while [ $attempt -le $MAX_RETRIES ]; do
        if [ $attempt -gt 0 ]; then
            echo "Retrying upload (attempt $((attempt + 1))/$((MAX_RETRIES + 1)))..." >&2
            sleep 2
        fi

        response=$(curl -s --max-time "$UPLOAD_TIMEOUT" \
            -X POST "$DEPLOY_ENDPOINT" \
            -F "file=@$tarball" \
            -F "framework=$framework" 2>&1) && curl_exit=0 || curl_exit=$?

        # Check if curl timed out (exit code 28)
        if [ $curl_exit -eq 28 ] && [ $attempt -lt $MAX_RETRIES ]; then
            echo "Upload timed out after ${UPLOAD_TIMEOUT}s" >&2
            attempt=$((attempt + 1))
            continue
        fi

        # Non-timeout curl error
        if [ $curl_exit -ne 0 ]; then
            emit_error "ERR_UPLOAD_FAILED" "curl failed with exit code $curl_exit"
            return 1
        fi

        # Got a response (success or error)
        echo "$response"
        return 0
    done

    emit_error "ERR_UPLOAD_TIMEOUT" "Upload timed out after $((MAX_RETRIES + 1)) attempts"
    return 1
}

# --- Main ---
INPUT_PATH="${1:-.}"

# Create temp directory for packaging
TEMP_DIR=$(mktemp -d)
TARBALL="$TEMP_DIR/project.tgz"
CLEANUP_TEMP=true

cleanup() {
    if [ "$CLEANUP_TEMP" = true ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

echo "Preparing deployment..." >&2

# Check if input is a .tgz file or a directory
FRAMEWORK="null"

if [ -f "$INPUT_PATH" ] && [[ "$INPUT_PATH" == *.tgz ]]; then
    echo "Using provided tarball..." >&2
    TARBALL="$INPUT_PATH"
    CLEANUP_TEMP=false
elif [ -d "$INPUT_PATH" ]; then
    PROJECT_PATH=$(cd "$INPUT_PATH" && pwd)

    # Detect framework
    FRAMEWORK=$(detect_framework "$PROJECT_PATH/package.json")

    # Static HTML: rename single non-index.html to index.html
    if [ ! -f "$PROJECT_PATH/package.json" ]; then
        HTML_FILES=$(find "$PROJECT_PATH" -maxdepth 1 -name "*.html" -type f)
        HTML_COUNT=$(echo "$HTML_FILES" | grep -c . || echo 0)

        if [ "$HTML_COUNT" -eq 1 ]; then
            HTML_FILE=$(echo "$HTML_FILES" | head -1)
            BASENAME=$(basename "$HTML_FILE")
            if [ "$BASENAME" != "index.html" ]; then
                echo "Renaming $BASENAME to index.html..." >&2
                mv "$HTML_FILE" "$PROJECT_PATH/index.html"
            fi
        fi
    fi

    # Create tarball (exclude sensitive + build artifacts)
    echo "Creating deployment package..." >&2
    tar -czf "$TARBALL" -C "$PROJECT_PATH" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='.env' \
        --exclude='.env.*' \
        --exclude='.env.local' \
        --exclude='.next' \
        --exclude='dist' \
        --exclude='build' \
        --exclude='coverage' \
        .
else
    emit_error "ERR_NO_PROJECT" "Input must be a directory or a .tgz file: $INPUT_PATH"
    exit 1
fi

if [ "$FRAMEWORK" != "null" ]; then
    echo "Detected framework: $FRAMEWORK" >&2
fi

# Deploy with retry
echo "Deploying..." >&2
RESPONSE=$(upload_with_retry "$TARBALL" "$FRAMEWORK")

# Check for error
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    emit_error "ERR_UPLOAD_FAILED" "$ERROR_MSG"
    exit 1
fi

# Extract URLs
PREVIEW_URL=$(echo "$RESPONSE" | grep -o '"previewUrl":"[^"]*"' | cut -d'"' -f4)
CLAIM_URL=$(echo "$RESPONSE" | grep -o '"claimUrl":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PREVIEW_URL" ]; then
    emit_error "ERR_UPLOAD_FAILED" "Could not extract preview URL from response"
    echo "$RESPONSE" >&2
    exit 1
fi

echo "" >&2
echo "✅ Deployment successful!" >&2
echo "" >&2
echo "Preview URL: $PREVIEW_URL" >&2
echo "Claim URL:   $CLAIM_URL" >&2
echo "" >&2

# Output JSON for programmatic use (stdout only)
echo "$RESPONSE"
