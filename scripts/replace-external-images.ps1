# Scans tamil-nadu and public/tamil-nadu index.html files
# Replaces external image URLs (via.placeholder.com and upload.wikimedia.org)
# with a local ../site_photos/... path found in the same HTML file.

Write-Host "Starting replacement of external images..."

$roots = @("tamil-nadu", "public/tamil-nadu", "dist/tamil-nadu")

foreach ($root in $roots) {
    $fullRoot = Join-Path -Path (Get-Location) -ChildPath $root
    if (-Not (Test-Path $fullRoot)) { continue }

    Get-ChildItem -Path $fullRoot -Recurse -Filter index.html -ErrorAction SilentlyContinue | ForEach-Object {
        $filePath = $_.FullName
        try {
            $content = Get-Content -Path $filePath -Raw -ErrorAction Stop
        } catch {
            Write-Warning ("Failed reading {0}: {1}" -f $filePath, $_.Exception.Message)
            return
        }

        # Try to find an existing ../site_photos/... path in the file to use as replacement
        $sitePhotoRegex = '\.\./site_photos/[^"''\)\s>]+'
        $sitePhotoMatch = [regex]::Match($content, $sitePhotoRegex)
        if ($sitePhotoMatch.Success) {
            $replacement = $sitePhotoMatch.Value.Trim()
        } else {
            # Fallback: build path from the html folder name
            $folderName = Split-Path -Path $_.DirectoryName -Leaf
            # Normalize folder name into TitleCase segments
            $parts = $folderName -split '[-_ ]+' | ForEach-Object {
                if ($_.Length -gt 0) { $_.Substring(0,1).ToUpper() + $_.Substring(1) } else { $_ }
            }
            $title = ($parts -join '')
            $replacement = "../site_photos/$title/1.jpg"
        }

        $orig = $content

        # Patterns to replace: via.placeholder.com and upload.wikimedia.org (http/https)
        $patternPlaceholder = 'https?://via\.placeholder\.com[^"''\s>]+'
        $patternWiki = 'https?://upload\.wikimedia\.org[^"''\s>]+'

        $new = [regex]::Replace($content, $patternPlaceholder, [regex]::Escape($replacement), [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        $new = [regex]::Replace($new, $patternWiki, [regex]::Escape($replacement), [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

        # Replace URLs inside openImageModal('URL','Caption') calls
        $new = [regex]::Replace($new, "openImageModal\('https?://[^']+','", "openImageModal('$replacement','", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

        if ($new -ne $orig) {
            try {
                Set-Content -Path $filePath -Value $new -ErrorAction Stop
                Write-Host ("Updated: {0}" -f $filePath)
            } catch {
                Write-Warning ("Failed to write {0}: {1}" -f $filePath, $_.Exception.Message)
            }
        }
    }
}

Write-Host "Replacement run complete. Please re-run verification script to confirm remaining external URLs."
