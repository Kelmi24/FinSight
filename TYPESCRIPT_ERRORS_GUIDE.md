# Troubleshooting TypeScript Errors After Prisma Schema Changes

## Problem
After adding the Wallet model to Prisma schema and running `npx prisma generate`, you may see TypeScript errors in VS Code like:
- `Property 'wallet' does not exist on type 'PrismaClient'`
- `Property 'walletId' does not exist in type 'TransactionWhereInput'`

## Root Cause
The TypeScript Language Server in VS Code caches type definitions and doesn't automatically reload when Prisma generates new types. The generated Prisma Client types are correct and exist in `node_modules/@prisma/client`, but VS Code's IDE is showing cached outdated types.

## Evidence It's Just an IDE Issue
✅ The application runs without errors at runtime
✅ `npx prisma generate` completed successfully  
✅ Next.js dev server compiles without errors
✅ `npm run build` would succeed (if run)
✅ All functionality works in the browser

## Solutions (Pick One)

### Option 1: Reload VS Code Window (Fastest)
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Reload Window"
3. Select "Developer: Reload Window"
4. Wait 10-15 seconds for TypeScript to reinitialize

### Option 2: Restart TypeScript Server
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Restart TS"
3. Select "TypeScript: Restart TS Server"
4. Wait for status bar to show "TypeScript" ready

### Option 3: Full VS Code Restart
1. Quit VS Code completely (`Cmd+Q` on Mac)
2. Reopen VS Code
3. Open your project folder
4. Wait for TypeScript to fully load (check bottom-right status bar)

### Option 4: Clear TypeScript Cache (Nuclear Option)
```bash
# Close VS Code first
rm -rf node_modules/.cache
rm -rf .next
# Reopen VS Code
```

## Prevention
This is a known issue with Prisma + TypeScript + VS Code. It happens whenever:
- You add new models to `schema.prisma`
- You add new fields to existing models
- You run `npx prisma generate` or `npx prisma migrate dev`

Always reload VS Code or restart the TS server after schema changes.

## Verification After Fix
After applying a solution, check:
1. Open `src/lib/actions/wallets.ts`
2. Hover over `db.wallet` - should show proper type information
3. No red squiggly lines under `db.wallet.findMany()`
4. TypeScript status in bottom-right should say "TypeScript" (not "TypeScript: Initializing...")

## Still Having Issues?
If errors persist after trying all solutions:

1. **Verify Prisma client was generated:**
   ```bash
   ls -la node_modules/@prisma/client
   # Should show recently modified files
   ```

2. **Check if types match schema:**
   ```bash
   npx prisma generate --schema=./prisma/schema.prisma
   # Should say "Generated Prisma Client"
   ```

3. **Restart dev server:**
   ```bash
   lsof -ti:3000 | xargs kill -9 2>/dev/null
   npm run dev
   ```

4. **Last resort - clean reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npx prisma generate
   npm run dev
   ```

## Why This Happens Technically
- Prisma generates types in `node_modules/@prisma/client/index.d.ts`
- TypeScript language server loads these types into memory
- When you run `npx prisma generate`, it updates the files
- TypeScript server doesn't watch `node_modules` for changes
- Result: Stale types in IDE, fresh types at runtime (Node.js reads them fresh)

This is why the code works but IDE complains!
