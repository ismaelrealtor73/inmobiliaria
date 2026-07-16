$csv = Import-Csv -LiteralPath "C:\Users\Usuario\Downloads\inmobiliaria\leads.csv" -Encoding UTF8
$rows = @($csv)

Write-Host "=============================================="
Write-Host "ANALISIS DETALLADO LEAD POR LEAD"
Write-Host "=============================================="
Write-Host ""

# Categorias de negocio
function Get-BizCategory {
    param($name)
    $n = $name.ToUpper()
    $cats = @(
        @("BAR", "CAFETER", "PUB", "TABERNA"),
        @("RESTAURANTE", "ASADOR", "STEAKHOUSE", "COMEDOR", "BODEGON"),
        @("HAMBURGUESERIA", "PIZZER", "KEBAB"),
        @("DISCOTECA", "NIGHT", "CLUB", "BEACH BAR"),
        @("PELUQUERIA", "ESTETICA", "TATTOO", "BELLLEZA", "NAIL"),
        @("CARNICERIA", "PANADER", "PAPELERIA", "COMESTIBLES"),
        @("SPORT", "GIMNASIO", "DEPORTE"),
        @("ECO", "CLINICA", "SALUD"),
        @("SHOWROOM", "TIENDA", "COMERCIO"),
        @("INMOBILIARIA", "ASESOR", "GESTOR"),
        @("HOSTAL", "HOTEL", "RESIDENCIA"),
        @("TALLER", "MECANICO", "AUTOMOCION")
    )
    $labels = @(
        "Bar/Cafeteria",
        "Restaurante",
        "Comida rapida",
        "Ocio nocturno",
        "Belleza",
        "Alimentacion",
        "Deporte",
        "Salud",
        "Tienda/Comercio",
        "Servicios profesionales",
        "Hosteleria",
        "Automocion"
    )
    for ($i = 0; $i -lt $cats.Length; $i++) {
        foreach ($kw in $cats[$i]) {
            if ($n -match $kw) { return $labels[$i] }
        }
    }
    return "Persona fisica / Indefinido"
}

# Extraer pueblo/ciudad del nombre o email
function Get-Location {
    param($name, $email)
    $text = "$name $email"
    $uc = $text.ToUpper()
    $places = @("MALAGA", "MARBELLA", "FUENGIROLA", "TORREMOLINOS", "BENALMADENA", "MIJAS", "ESTEPONA", "NERJA", "RINCON", "VELEZ", "ANTEQUERA", "MOLLINA", "SEVILLA", "COSTA DEL SOL", "TEATINOS", "CARTAYA", "HUELVA", "MARCHAL")
    foreach ($p in $places) {
        if ($uc -match $p) { return $p.Substring(0,1) + $p.Substring(1).ToLower() }
    }
    return "Sin ubicacion clara"
}

# Nivel de interes
function Get-InterestLevel {
    param($name, $email)
    $text = "$name $email".ToLower()
    if ($text -match "traspaso|vendo|compro|busco|inversor|local|negocio|alquiler") { return "ALTO" }
    if ($text -match "restaurant|bar|cafe|tienda|peluqueria") { return "MEDIO" }
    return "BAJO (sin contexto)"
}

Write-Host "========================"
Write-Host "CATEGORIZACION GENERAL"
Write-Host "========================"
Write-Host ""

$cats = @{}
$locations = @{}
$interest = @{"ALTO"=0;"MEDIO"=0;"BAJO"=0}

foreach ($r in $rows) {
    $cat = Get-BizCategory $r.Nombre
    $loc = Get-Location $r.Nombre $r.'Correo electronico'
    $int = Get-InterestLevel $r.Nombre $r.'Correo electronico'
    
    if (-not $cats[$cat]) { $cats[$cat] = 0 }
    $cats[$cat]++
    if (-not $locations[$loc]) { $locations[$loc] = 0 }
    $locations[$loc]++
    $interest[$int]++
}

Write-Host "TIPOS DE NEGOCIO DETECTADOS:"
$cats.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    $pct = [math]::Round($_.Value / $rows.Count * 100, 1)
    Write-Host "  $($_.Key): $($_.Value) ($pct%)"
}
Write-Host ""

Write-Host "UBICACIONES DETECTADAS:"
$locations.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "  $($_.Key): $($_.Value)"
}
Write-Host ""

Write-Host "NIVEL DE INTERES ESTIMADO:"
$interest.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "  $($_.Key): $($_.Value)"
}
Write-Host ""

Write-Host "========================"
Write-Host "LEAD POR LEAD DETALLADO"
Write-Host "========================"
Write-Host ""
Write-Host "NOTA: Sin datos de mensaje/propiedad interesada, el analisis es"
Write-Host "limitado. Se usan pistas de nombre y email."
Write-Host ""

$count = 0
foreach ($r in $rows) {
    $count++
    $cat = Get-BizCategory $r.Nombre
    $loc = Get-Location $r.Nombre $r.'Correo electronico'
    $tieneWhatsapp = if ($r.'Numero de WhatsApp') { "SI" } else { "NO" }
    $tlf = $r.Telefono
    if ($tlf.Length -gt 12) { $tlf = $tlf.Substring(0,12) + "..." }
    
    Write-Host "--- LEAD $count ---"
    Write-Host "  Nombre: $($r.Nombre.Trim())"
    Write-Host "  Email: $($r.'Correo electronico'.Trim())"
    Write-Host "  Telefono: $tlf"
    Write-Host "  Tipo: $cat"
    Write-Host "  Ubicacion: $loc"
    Write-Host "  Estado: $($r.Estado)"
    Write-Host "  Campana: $($r.Formulario)"
    Write-Host "  Fecha: $($r.Creado)"
    Write-Host ""
}

Write-Host "========================"
Write-Host "RECOMENDACIONES"
Write-Host "========================"
Write-Host ""
Write-Host "Leads de HOSTELERIA sin contactar (prioridad 1):"
$hosteleria = $rows | Where-Object {
    $n = $_.Nombre.ToUpper()
    ($n -match "BAR" -or $n -match "RESTAURANTE" -or $n -match "CAFETER" -or $n -match "PUB" -or $n -match "TABERNA" -or $n -match "ASADOR" -or $n -match "HAMBURGUESERIA" -or $n -match "PIZZER" -or $n -match "KEBAB" -or $n -match "BEACH" -or $n -match "BODEGON" -or $n -match "STEAKHOUSE" -or $n -match "HOSTAL" -or $n -match "CLUB" -or $n -match "DISCOTECA")
} | Where-Object { $_.Estado -ne 'CONTACTADOS' }
$hosteleria | ForEach-Object {
    Write-Host "  - $($_.Nombre.Trim()) | $($_.Telefono) | $($_.'Correo electronico')"
}
Write-Host ""
Write-Host "Leads de COMERCIO / SERVICIOS sin contactar (prioridad 2):"
$comercio = $rows | Where-Object {
    $n = $_.Nombre.ToUpper()
    ($n -match "TATTOO" -or $n -match "SPORT" -or $n -match "PELUQUERIA" -or $n -match "SHOWROOM" -or $n -match "ECO" -or $n -match "CARNICERIA" -or $n -match "PAPELERIA" -or $n -match "CLINICA")
} | Where-Object { $_.Estado -ne 'CONTACTADOS' }
$comercio | ForEach-Object {
    Write-Host "  - $($_.Nombre.Trim()) | $($_.Telefono) | $($_.'Correo electronico')"
}
Write-Host ""
Write-Host "Leads de CAMPAÑA ALQUILER sin contactar (prioridad 3):"
$alquiler = $rows | Where-Object { $_.Formulario -eq 'SG_ALQUILER-OCT' -and $_.Estado -ne 'CONTACTADOS' }
$alquiler | ForEach-Object {
    Write-Host "  - $($_.Nombre.Trim()) | $($_.Telefono) | $($_.'Correo electronico')"
}
