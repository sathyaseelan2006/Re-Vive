# PowerShell script to add Vercel Analytics to all Tamil Nadu heritage site pages
# This script adds the analytics script tag to the <head> section of each heritage site's index.html

$heritageSites = @(
    "chennai",
    "chettinad",
    "chidambaram",
    "darasuram",
    "fort-st-george",
    "gangaikonda-cholapuram",
    "gingee-fort",
    "kanchipuram",
    "kanyakumari",
    "keeladi",
    "madurai",
    "nilgiris-ooty",
    "palani",
    "rameswaram",
    "rockfort-tiruchirappalli",
    "srirangam",
    "srivilliputhur",
    "thanjavur",
    "thiruchendur",
    "tiruvannamalai",
    "vellore-fort"
)

$analyticsScript = @"
    
    <!-- Vercel Analytics -->
    <script type="module" src="../../js/analytics.js"></script>
"@

$successCount = 0
$failCount = 0
$skippedCount = 0

Write-Host "Starting to add Vercel Analytics to heritage site pages..." -ForegroundColor Cyan
Write-Host ""

foreach ($site in $heritageSites) {
    $filePath = "tamil-nadu\$site\index.html"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Check if analytics is already added
        if ($content -match "Vercel Analytics") {
            Write-Host "⏭️  Skipped: $site (analytics already present)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Find the closing </head> tag and insert analytics before it
        if ($content -match "</head>") {
            $newContent = $content -replace "</head>", "$analyticsScript`r`n</head>"
            
            # Write the updated content back to the file
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8 -NoNewline
            
            Write-Host "✅ Added analytics to: $site" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "❌ Failed: $site (no </head> tag found)" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Host "⚠️  Not found: $site" -ForegroundColor Yellow
        $failCount++
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Successfully added: $successCount" -ForegroundColor Green
Write-Host "  ⏭️  Skipped (already present): $skippedCount" -ForegroundColor Yellow
Write-Host "  ❌ Failed: $failCount" -ForegroundColor Red
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vercel Analytics integration complete! 🎉" -ForegroundColor Green
