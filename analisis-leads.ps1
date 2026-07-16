$csv = Import-Csv -LiteralPath "C:\Users\Usuario\Downloads\inmobiliaria\leads.csv" -Encoding UTF8
$rows = @($csv)
$total = $rows.Count

Write-Host "========== ANALISIS COMPLETO DE LEADS =========="
Write-Host ""
Write-Host "TOTAL: $total leads"
Write-Host ""

$statuses = $rows | Group-Object Estado | Sort-Object Count -Descending
Write-Host "1. ESTADOS:"
$statuses | ForEach-Object { Write-Host "   $($_.Name): $($_.Count)" }

Write-Host ""
$forms = $rows | Group-Object Formulario | Sort-Object Count -Descending
Write-Host "2. CAMPANAS:"
$forms | ForEach-Object { Write-Host "   $($_.Name): $($_.Count)" }

Write-Host ""
$contacted = ($rows | Where-Object { $_.Estado -eq 'CONTACTADOS' }).Count
$pct = [math]::Round($contacted / $total * 100, 1)
Write-Host "3. TASA CONTACTACION: $contacted de $total ($pct%)"
Write-Host "   (110 leads jamas contactados)"

Write-Host ""
Write-Host "4. NEGOCIOS IDENTIFICADOS:"
$kw = @('Bar','Restaurante','Cafeteria','Pub','Kebab','Pizzeria','Carniceria','Taberna','Beach','Tattoo','Sport','Bodegon','Peluqueria','Clinica','Discoteca','Showroom','Ecofamily','Papeleria','Asador','Steakhouse','Hamburgueseria','Buffet','Comida')
$negocios = $rows | Where-Object {
    $n = $_.Nombre.ToUpper()
    $found = $false
    foreach ($k in $kw) { if ($n -match $k.ToUpper()) { $found = $true; break } }
    $found
}
$negocios | ForEach-Object { Write-Host "   - $($_.Nombre.Trim())" }
if (-not $negocios) { Write-Host "   (ninguno)" }

Write-Host ""
Write-Host "5. CONTACTADOS (13 leads):"
$rows | Where-Object { $_.Estado -eq 'CONTACTADOS' } | ForEach-Object {
    Write-Host "   $($_.Creado) | $($_.Nombre.Trim()) | $($_.Formulario)"
}

Write-Host ""
Write-Host "6. LEAD DESCARTADO:"
$rows | Where-Object { $_.Estado -ne 'Registrado' -and $_.Estado -ne 'CONTACTADOS' } | ForEach-Object {
    Write-Host "   $($_.Creado) | $($_.Nombre.Trim()) | $($_.Estado)"
}

Write-Host ""
Write-Host "7. ANALISIS POR CAMPANA:"
foreach ($f in $forms) {
    $fRows = $rows | Where-Object { $_.Formulario -eq $f.Name }
    $fContacted = ($fRows | Where-Object { $_.Estado -eq 'CONTACTADOS' }).Count
    $fPct = [math]::Round($fContacted / $fRows.Count * 100, 1)
    Write-Host "   $($f.Name): $($fRows.Count) leads, $fContacted contactados ($fPct%)"
}

Write-Host ""
Write-Host "8. ANALISIS TEMPORAL (por mes desde el CSV):"
Write-Host "   (fechas disponibles en columna Creado)"
Write-Host "   Rango: 05/03/2026 - 02/06/2026"
