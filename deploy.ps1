# Variables - customize these
$repoPath = "C:\Base Launch\baselaunch"
$commitMessage = "Deploy app source and config"
$remoteName = "origin"
$branchName = "master"  # or main
$netlifySiteId = "https://baselaunch.netlify.app/"  # get from Netlify dashboard
$netlifyAuthToken = "nfp_NAP7ukN7Ay2PFC1pKoSV59GVAndN1Z5m0a57"  # generate from Netlify user settings

# Change to repo directory
Set-Location -Path $repoPath

# Stage all changes
git add .

# Commit changes
git commit -m "$commitMessage"

# Push to remote repository
git push $remoteName $branchName

# Trigger Netlify deploy using Netlify CLI and API
netlify deploy --site $netlifySiteId --auth $netlifyAuthToken --prod

Write-Output "Deployment triggered successfully!"
