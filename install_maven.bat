@echo off
echo Installing Maven on Windows...

REM Create Maven directory if it doesn't exist
if not exist "C:\maven" mkdir "C:\maven"

REM Download Maven
powershell -Command "Invoke-WebRequest -Uri 'https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile 'C:\maven\maven.zip'"

REM Extract Maven
powershell -Command "Expand-Archive -Path 'C:\maven\maven.zip' -DestinationPath 'C:\maven' -Force"

REM Rename the extracted folder
ren "C:\maven\apache-maven-3.9.6" maven-3.9.6

REM Add Maven to PATH
setx /M PATH "%PATH%;C:\maven\maven-3.9.6\bin"

echo Maven installation complete. Please restart your terminal or command prompt for changes to take effect.
echo You can test if Maven is installed by running: mvn --version