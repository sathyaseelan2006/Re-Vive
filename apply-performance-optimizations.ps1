# Performance Optimization Automation Script
# Applies performance enhancements to all Tamil Nadu heritage pages

Write-Host "🚀 Starting Performance Optimization..." -ForegroundColor Cyan
Write-Host ""

$rootPath = "d:\underprogress\edaproject"
$pagesProcessed = 0
$pagesUpdated = 0

# Find all index.html files in tamil-nadu folder
$pages = Get-ChildItem -Path "$rootPath\tamil-nadu" -Filter "index.html" -Recurse

Write-Host "Found $($pages.Count) pages to optimize" -ForegroundColor Yellow
Write-Host ""

foreach ($page in $pages) {
    $pagesProcessed++
    $updated = $false
    $pageName = $page.Directory.Name
    
    Write-Host "[$pagesProcessed/$($pages.Count)] Processing: $pageName" -ForegroundColor White
    
    $content = Get-Content $page.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Check what's already present
    $hasPerformanceCSS = $content.Contains("performance-optimizations.css")
    $hasPerformanceJS = $content.Contains("performance-utils.js")
    $hasChatbotLazy = $content.Contains("chatbot-lazy-loader.js")
    
    # 1. Add performance CSS if not present
    if (-not $hasPerformanceCSS) {
        $cssLink = '    <link rel="stylesheet" href="../../css/performance-optimizations.css">'
        $searchFor = '    <link rel="stylesheet"'
        if ($content.Contains($searchFor)) {
            $content = $content.Replace($searchFor, "$cssLink`r`n$searchFor")
            Write-Host "  ✓ Added performance-optimizations.css" -ForegroundColor Green
            $updated = $true
        }
    }
    
    # 2. Add performance-utils.js before other scripts if not present
    if (-not $hasPerformanceJS) {
        $jsScript = '    <script src="../../js/performance-utils.js" defer></script>'
        $searchFor = '    <script src='
        if ($content.Contains($searchFor)) {
            $content = $content.Replace($searchFor, "$jsScript`r`n$searchFor")
            Write-Host "  ✓ Added performance-utils.js" -ForegroundColor Green
            $updated = $true
        }
    }
    
    # 3. Replace improved-chatbot.js with lazy loader
    if (-not $hasChatbotLazy) {
        if ($content.Contains('improved-chatbot.js')) {
            $content = $content.Replace('improved-chatbot.js', 'chatbot-lazy-loader.js')
            Write-Host "  ✓ Switched to lazy chatbot loader" -ForegroundColor Green
            $updated = $true
        }
    }
    
    # 4. Add defer attribute to script tags that don't have it
    if ($content.Contains('<script src="../') -and -not $content.Contains('defer')) {
        # Simple replacement for common patterns
        $content = $content.Replace('<script src="../professional-chatbot.js">', '<script src="../professional-chatbot.js" defer>')
        $content = $content.Replace('<script src="../improved-chatbot.js">', '<script src="../improved-chatbot.js" defer>')
        $content = $content.Replace('<script src="../chatbot-lazy-loader.js">', '<script src="../chatbot-lazy-loader.js" defer>')
        $scriptPath = "$($page.Directory.Name)-script.js"
        $content = $content.Replace("<script src=`"$scriptPath`">", "<script src=`"$scriptPath`" defer>")
        Write-Host "  ✓ Added defer to script tags" -ForegroundColor Green
        $updated = $true
    }
    
    # 5. Add loading="lazy" to gallery images
    if ($content.Contains("card-image") -and -not $content.Contains("loading")) {
        $oldImg = "class=`"card-image`""
        $newImg = "class=`"card-image`" loading=`"lazy`" decoding=`"async`""
        $content = $content.Replace($oldImg, $newImg)
        Write-Host "  ✓ Added lazy loading to gallery images" -ForegroundColor Green
        $updated = $true
    }
    
    # Save if updated
    if ($updated -and $content -ne $originalContent) {
        Set-Content -Path $page.FullName -Value $content -Encoding UTF8 -NoNewline
        $pagesUpdated++
        Write-Host "  ✅ Page optimized successfully!" -ForegroundColor Cyan
    } else {
        Write-Host "  ℹ️  No changes needed" -ForegroundColor Gray
    }
    
    Write-Host ""
}

# Summary
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "✅ Optimization Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Pages processed: $pagesProcessed" -ForegroundColor White
Write-Host "Pages updated:   $pagesUpdated" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test pages in browser" -ForegroundColor White
Write-Host "2. Run Lighthouse audits" -ForegroundColor White
Write-Host "3. Check console for errors" -ForegroundColor White
Write-Host "4. Verify lazy loading works" -ForegroundColor White
Write-Host ""
Write-Host "="*60 -ForegroundColor Cyan
