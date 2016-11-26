# sudo rsync -avz -e "ssh -i /mnt/f/villageexperts/farookvillage/webrtckeypair.pem"
# 	/mnt/f/villageexperts/villageexperts_webrtc/ ubuntu@dev.villageexperts.com:/home/ubuntu/villageexperts_webrtc/

sudo rsync /mnt/f/villageexperts/villageexperts_webrtc/ -i /mnt/f/villageexperts/farookvillage/webrtckeypair.pem ubuntu@dev.villageexperts.com:/home/ubuntu/villageexperts_webrtc/ --rsh ssh --recursive --delete --exclude=.git* --exclude=*.scss --exclude=node_modules --exclude=cache --exclude=logs -avz --verbose