dc-nuclear:
	- docker stop $$(docker ps -a -q)
	- docker kill $$(docker ps -q)
	- docker rm $$(docker ps -a -q)
	- docker rm $$(docker ps -a -q)
	- docker rmi $$(docker images -q)
	- docker system prune --all --force --volumes

dcup-dev:
	docker-compose up

dcup-prod:
	docker-compose -f ./docker-compose.prod.yaml up

dc-down:
	docker-compose down

dc-clear:
	docker-compose down
	docker rmi -f standupcode-k8s-dev.com admin.standupcode-k8s-dev.com 

hosts:
	sudo -- sh -c "echo 127.0.0.1  standupcode-k8s-dev.com >> /etc/hosts"
	sudo -- sh -c "echo 127.0.0.1  admin.standupcode-k8s-dev.com >> /etc/hosts"

rm-hosts:
	sudo -- sh -c "sed -i '' '/127.0.0.1 standupcode-k8s-dev.com/d' /etc/hosts"
	sudo -- sh -c "sed -i '' '/127.0.0.1 admin.standupcode-k8s-dev.com/d' /etc/hosts"