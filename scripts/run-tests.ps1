param(
    [Parameter(Mandatory = $true)]
    [string]$Suite
)

$cache = Join-Path $env:JENKINS_HOME 'maven-cache'
New-Item -ItemType Directory -Force -Path $cache | Out-Null
& mvn -B "-Dmaven.repo.local=$cache" "-Dtest=$Suite" test
exit $LASTEXITCODE
