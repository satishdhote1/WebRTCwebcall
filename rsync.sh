sudo rsync -avz -e "ssh -i /home/altanai/webrtcWSwksppace/villagexpert/farook/webrtckeypair.pem" \
	~/webrtcWSwksppace/villagexpert/villageexperts_webrtc/ \
	ubuntu@54.193.124.35:~/villageexperts_webrtc/


rsync /home/altanai/webrtcWSwksppace/villagexpert/villageexperts_webrtc/ -i /home/altanai/webrtcWSwksppace/villagexpert/farook/webrtckeypair.pem ubuntu@54.193.124.35:~/villageexperts_webrtc/ --rsh ssh --recursive --delete --exclude=.git* --exclude=*.scss --exclude=node_modules --exclude=cache --exclude=logs -avz --verbose