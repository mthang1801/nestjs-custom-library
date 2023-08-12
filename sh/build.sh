sudo apt-get update -y 
sudo apt-get install git-core  -y
sudo git config --global user.name "mthang1801"
sudo git config --global user.email "mthang1801@gmail.com"
git config --global credential.helper store
sudo git config --global credential.helper store
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
sudo nvm install v16 -y
sudo apt-get install docker.io -y
sudo curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose23