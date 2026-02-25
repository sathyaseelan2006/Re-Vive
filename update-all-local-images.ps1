# Update ALL Locations to Use Local Images
Write-Host "Updating all heritage pages to use local images..." -ForegroundColor Cyan
Write-Host ""

$updates = @(
    # Chettinad - has 4 images in Chettinad folder
    @{ Location = "chettinad"; Folder = "Chettinad"; Files = 4 },
    
    # Darasuram - has 10 images in Darasuram folder  
    @{ Location = "darasuram"; Folder = "Darasuram"; Files = 10 },
    
    # Fort St. George - has 6 images in FortStGeorge folder
    @{ Location = "fort-st-george"; Folder = "FortStGeorge"; Files = 6 },
    
    # Gingee Fort - has 4 images in GingeeFort folder
    @{ Location = "gingee-fort"; Folder = "GingeeFort"; Files = 4 },
    
    # Kanyakumari - has 15 images in Kanyakumari folder
    @{ Location = "kanyakumari"; Folder = "Kanyakumari"; Files = 15 },
    
    # Keeladi - has 12 images in Keeladi folder
    @{ Location = "keeladi"; Folder = "Keeladi"; Files = 12 },
    
    # Nilgiris-Ooty - has 5 images in NilgirisOoty folder
    @{ Location = "nilgiris-ooty"; Folder = "NilgirisOoty"; Files = 5 },
    
    # Palani - has 3 images in Palani folder
    @{ Location = "palani"; Folder = "Palani"; Files = 3 },
    
    # Rameswaram - has 2 images in Rameswaram folder
    @{ Location = "rameswaram"; Folder = "Rameswaram"; Files = 2 },
    
    # Rockfort Tiruchirappalli - has 5 images in Rockfort folder
    @{ Location = "rockfort-tiruchirappalli"; Folder = "Rockfort"; Files = 5 },
    
    # Thiruchendur - has 3 images in Thiruchendur folder
    @{ Location = "thiruchendur"; Folder = "Thiruchendur"; Files = 3 },
    
    # Tiruvannamalai - has 5 images in Tiruvannamalai folder
    @{ Location = "tiruvannamalai"; Folder = "Tiruvannamalai"; Files = 5 },
    
    # Vellore Fort - has 2 images in VelloreFort folder
    @{ Location = "vellore-fort"; Folder = "VelloreFort"; Files = 2 }
)

$updated = 0

foreach ($update in $updates) {
    $loc = $update.Location
    $folder = $update.Folder
    $htmlPath = "d:\underprogress\edaproject\tamil-nadu\$loc\index.html"
    
    if (Test-Path $htmlPath) {
        $content = Get-Content $htmlPath -Raw -Encoding UTF8
        $changed = $false
        
        # Update hero image (change Wikipedia/placeholder to local)
        if ($content -match 'class="site-main-image"[^>]*src="https://') {
            # Replace Wikipedia/placeholder URLs with local image
            $content = $content -replace '(<img[^>]*class="site-main-image"[^>]*)src="https://[^"]*"', "`$1src=`"$folder/1.jpg`""
            $changed = $true
            Write-Host "  [+] Updated hero image" -ForegroundColor Green
        }
        
        # Update gallery card images (replace placeholders with numbered images)
        $cardCount = 1
        while ($content -match 'class="card-image"[^>]*src="https://via\.placeholder') {
            $content = $content -replace '(<img[^>]*class="card-image"[^>]*)src="https://via\.placeholder[^"]*"', "`$1src=`"$folder/$cardCount.jpg`""
            $cardCount++
            $changed = $true
            if ($cardCount -gt $update.Files) { break }
        }
        
        # Update modal onclick handlers with placeholders
        $content = $content -replace "onclick='openImageModal\('https://via\.placeholder[^']*'", "onclick='openImageModal('$folder/1.jpg'"
        $content = $content -replace 'onclick="openImageModal\(''https://via\.placeholder[^'']*''', "onclick=`"openImageModal('$folder/1.jpg'"
        
        if ($changed) {
            Set-Content -Path $htmlPath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "[OK] $loc - Updated to use $folder/ images" -ForegroundColor Cyan
            $updated++
        }
    }
}

Write-Host ""
$separator = "="*60
Write-Host $separator -ForegroundColor Cyan
Write-Host "Updated $updated locations to use local images" -ForegroundColor Green
Write-Host $separator -ForegroundColor Cyan
