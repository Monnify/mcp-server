const API_KEY_PATTERN = /^MK_(TEST|PROD)_[A-Za-z0-9]{10}/;
export function assertEnvironmentConsistency(env) {
    const isProductionUrl = env.MONNIFY_BASE_URL.includes("app.monnify.com");
    const isProductionEnv = env.MONNIFY_ENV === "production";
    if (isProductionUrl && !isProductionEnv) {
        process.stderr.write("\n⚠️  WARNING: MONNIFY_BASE_URL points to production but MONNIFY_ENV is not \"production\".\n" +
            '   Set MONNIFY_ENV=production explicitly to confirm this is intentional.\n\n');
        process.exit(1);
    }
    if (!isProductionUrl && isProductionEnv) {
        process.stderr.write("\n⚠️  WARNING: MONNIFY_ENV is \"production\" but MONNIFY_BASE_URL does not point to app.monnify.com.\n" +
            "   Check your configuration.\n\n");
        process.exit(1);
    }
    assertApiKeyMatchesEnvironment(env.MONNIFY_API_KEY, isProductionEnv);
    if (isProductionUrl && isProductionEnv) {
        process.stderr.write("\n🔴 PRODUCTION MODE — All operations affect real funds and real accounts.\n\n");
    }
}
function assertApiKeyMatchesEnvironment(apiKey, isProductionEnv) {
    const match = API_KEY_PATTERN.exec(apiKey);
    if (!match)
        return;
    const isSandboxKey = match[1] === "TEST";
    if (isProductionEnv && isSandboxKey) {
        process.stderr.write("\n❌ ERROR: A sandbox API key (MK_TEST_...) was provided but MONNIFY_ENV is \"production\".\n" +
            "   Use your live API key or switch to the sandbox environment.\n\n");
        process.exit(1);
    }
    if (!isProductionEnv && !isSandboxKey) {
        process.stderr.write("\n❌ ERROR: A production API key (MK_PROD_...) was provided but MONNIFY_ENV is \"sandbox\".\n" +
            "   Use your sandbox API key or set MONNIFY_ENV=production.\n\n");
        process.exit(1);
    }
}
export function isOperationAllowed(category, env) {
    if (!env.MONNIFY_ALLOWED_OPERATIONS)
        return true;
    return env.MONNIFY_ALLOWED_OPERATIONS.split(",")
        .map((s) => s.trim())
        .includes(category);
}
//# sourceMappingURL=guards.js.map