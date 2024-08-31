version=$(sh ./scripts/get-version.sh)
echo $version
docker build -t auto.mate:$version .
docker tag auto.mate:$version nathan2hao/auto.mate:$version
docker tag auto.mate:$version nathan2hao/auto.mate:latest
docker push nathan2hao/auto.mate:$version
docker push nathan2hao/auto.mate:latest