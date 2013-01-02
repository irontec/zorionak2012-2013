while true; do
rsync -avzpq -e ssh $(find /root/capture/ -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ") irontec@www.irontec.com:/final/path/in_the_webserver/live/current.jpeg
echo -n .
done
