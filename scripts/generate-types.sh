#!/usr/bin/env bash
set -e

echo "Generating TypeScript types from OpenAPI spec..."
npx openapi-typescript openapi/monnify.yaml -o src/types/monnify-api.d.ts

echo "Generating Zod schemas from OpenAPI spec..."
npx openapi-zod-client openapi/monnify.yaml -o src/schemas/generated.ts

echo "Patching generated file..."
python3 - <<'PYEOF'
import re

with open('src/schemas/generated.ts', 'r') as f:
    content = f.read()

# Give schemas an explicit index signature type so the declaration generator
# doesn't have to serialize the full 200+ ZodObject union
content = content.replace(
    'export const schemas = {',
    'export const schemas: { [k: string]: import("zod").ZodTypeAny } = {'
)

# Silence the remaining declaration-size errors on api / createApiClient
content = re.sub(
    r'\nexport const api = new Zodios\(',
    '\nexport const api: any = new Zodios(',
    content
)
content = re.sub(
    r'\nexport function createApiClient\(baseUrl: string, options\?: ZodiosOptions\)',
    '\nexport function createApiClient(baseUrl: string, options?: ZodiosOptions): any',
    content
)

with open('src/schemas/generated.ts', 'w') as f:
    f.write(content)

print("Patched.")
PYEOF

echo "Done. Run tsc to verify types."
