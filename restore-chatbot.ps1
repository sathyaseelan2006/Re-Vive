# Restore Original Chatbot System
Write-Host "Restoring original improved-chatbot.js across all pages..." -ForegroundColor Cyan
Write-Host ""

$locations = @(
    "chennai", "chettinad", "chidambaram", "darasuram", "fort-st-george",
    "gangaikonda-cholapuram", "gingee-fort", "kanchipuram", "kanyakumari",
    "keeladi", "madurai", "mahabalipuram", "nilgiris-ooty", "palani",
    "rameswaram", "rockfort-tiruchirappalli", "srirangam", "srivilliputhur",
    "thanjavur", "thiruchendur", "tiruvannamalai", "vellore-fort"
)

$restored = 0

foreach ($location in $locations) {
    $filePath = "d:\underprogress\edaproject\tamil-nadu\$location\index.html"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        if ($content.Contains("chatbot-lazy-loader.js")) {
            $content = $content.Replace("chatbot-lazy-loader.js", "improved-chatbot.js")
            Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "[OK] $location - Restored improved-chatbot.js" -ForegroundColor Green
            $restored++
        } else {
            Write-Host "[--] $location - Already using improved-chatbot.js" -ForegroundColor Gray
        }
    }
}

Write-Host ""
$separator = "="*60
Write-Host $separator -ForegroundColor Cyan
Write-Host "Restored original chatbot on $restored pages" -ForegroundColor Green
Write-Host $separator -ForegroundColor Cyan
